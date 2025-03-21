import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient, GetIdCommand } from "@aws-sdk/client-cognito-identity";
import { BankAccount, Transaction } from "@/types/bank";
import { v4 as uuidv4 } from "uuid";
import jwt from 'jsonwebtoken';

class TokenExpiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenExpiredError';
  }
}

function createDynamoDBClient(idToken: string) {
  // Extract the Cognito Identity ID from the JWT token
  const decodedToken = jwt.decode(idToken) as { sub: string; exp: number };
  if (!decodedToken?.sub) {
    throw new Error("Invalid ID token");
  }

  // Check if token is expired
  if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
    throw new TokenExpiredError("Token has expired");
  }

  const cognitoIdentityClient = new CognitoIdentityClient({ region: process.env.AWS_REGION });
  const credentials = fromCognitoIdentityPool({
    client: cognitoIdentityClient,
    identityPoolId: process.env.COGNITO_IDENTITY_POOL_ID!,
    logins: {
      [`cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID!}`]: idToken,
    },
  });

  // Get the Cognito Identity ID
  const getIdentityId = async () => {
    const command = new GetIdCommand({
      IdentityPoolId: process.env.COGNITO_IDENTITY_POOL_ID!,
      Logins: {
        [`cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID!}`]: idToken,
      },
    });
    const response = await cognitoIdentityClient.send(command);
    return response.IdentityId;
  };

  const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials,
  });

  return {
    docClient: DynamoDBDocumentClient.from(client),
    getIdentityId,
  };
}

export async function getAccounts(userId: string, idToken: string): Promise<BankAccount[]> {
  try {
    const { docClient, getIdentityId } = createDynamoDBClient(idToken);
    const cognitoIdentityId = await getIdentityId();

    const command = new ScanCommand({
      TableName: "BankAccounts",
    });

    const response = await docClient.send(command);
    const allAccounts = response.Items as BankAccount[];
    
    // Filter accounts in memory to only return those belonging to the current user
    return allAccounts.filter(account => account.userId === cognitoIdentityId);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw error;
    }
    console.error("Error in getAccounts:", error);
    throw new Error("Failed to fetch accounts");
  }
}

export async function getAccount(userId: string, accountId: string, idToken: string): Promise<BankAccount | null> {
  try {
    const { docClient, getIdentityId } = createDynamoDBClient(idToken);
    const cognitoIdentityId = await getIdentityId();

    const command = new GetCommand({
      TableName: "BankAccounts",
      Key: {
        userId: cognitoIdentityId,
        accountId,
      },
    });

    const response = await docClient.send(command);
    return response.Item as BankAccount | null;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw error;
    }
    console.error("Error in getAccount:", error);
    throw new Error("Failed to fetch account");
  }
}

export async function createAccount(userId: string, name: string, idToken: string): Promise<BankAccount> {
  try {
    const { docClient, getIdentityId } = createDynamoDBClient(idToken);
    const cognitoIdentityId = await getIdentityId();
    
    const accountId = uuidv4();
    const now = new Date().toISOString();
    
    const newAccount: BankAccount = {
      userId: cognitoIdentityId,
      accountId,
      name,
      accountNumber: generateAccountNumber(),
      balance: 0,
      interestRate: 2.5,
      transactions: [],
      createdAt: now,
    };

    const command = new PutCommand({
      TableName: "BankAccounts",
      Item: newAccount,
    });

    await docClient.send(command);
    return newAccount;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw error;
    }
    console.error("Error in createAccount:", error);
    throw new Error("Failed to create account");
  }
}

export async function addTransaction(
  userId: string,
  accountId: string,
  transaction: Omit<Transaction, "transactionId" | "timestamp" | "runningBalance">,
  idToken: string
): Promise<BankAccount> {
  try {
    const { docClient, getIdentityId } = createDynamoDBClient(idToken);
    const cognitoIdentityId = await getIdentityId();

    const account = await getAccount(cognitoIdentityId, accountId, idToken);
    if (!account) {
      throw new Error("Account not found");
    }

    const now = new Date().toISOString();
    const newTransaction: Transaction = {
      transactionId: uuidv4(),
      ...transaction,
      timestamp: now,
      runningBalance:
        account.balance +
        (transaction.type === "deposit" ? transaction.amount : -transaction.amount),
    };

    const command = new UpdateCommand({
      TableName: "BankAccounts",
      Key: {
        userId: cognitoIdentityId,
        accountId,
      },
      UpdateExpression:
        "SET balance = balance + :amount, transactions = list_append(if_not_exists(transactions, :empty_list), :transaction)",
      ExpressionAttributeValues: {
        ":amount": transaction.type === "deposit" ? transaction.amount : -transaction.amount,
        ":transaction": [newTransaction],
        ":empty_list": [],
      },
      ReturnValues: "ALL_NEW",
    });

    const response = await docClient.send(command);
    return response.Attributes as BankAccount;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw error;
    }
    console.error("Error in addTransaction:", error);
    throw new Error("Failed to add transaction");
  }
}

function generateAccountNumber(): string {
  return Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
  ).join("-");
} 