import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  CognitoIdentityClient,
  GetIdCommand,
  GetCredentialsForIdentityCommand,
} from "@aws-sdk/client-cognito-identity";
import { BankAccount, Transaction } from "@/types/bank";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { time } from "console";
import { calculateInterestSinceLastTransaction } from "@/app/utils/interest";

export class TokenExpiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenExpiredError";
  }
}

export async function createDynamoDBClient() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    throw new Error("No access token found");
  }

  // Decode the access token
  const decodedToken = JSON.parse(
    Buffer.from(session.accessToken.split(".")[1], "base64").toString()
  );

  // Check if token is expired
  if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
    throw new TokenExpiredError("Token has expired");
  }

  const cognitoIdentityClient = new CognitoIdentityClient({
    region: process.env.AWS_REGION,
  });
  const getIdCommand = new GetIdCommand({
    IdentityPoolId: process.env.COGNITO_IDENTITY_POOL_ID,
    Logins: {
      [`cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`]:
        session.idToken as string,
    },
  });

  const { IdentityId } = await cognitoIdentityClient.send(getIdCommand);
  if (!IdentityId) {
    throw new Error("Failed to get Cognito Identity ID");
  }

  // Get temporary credentials from Cognito Identity
  const getCredentialsCommand = new GetCredentialsForIdentityCommand({
    IdentityId,
    Logins: {
      [`cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`]:
        session.idToken as string,
    },
  });

  const { Credentials } = await cognitoIdentityClient.send(
    getCredentialsCommand
  );
  if (!Credentials) {
    throw new Error("Failed to get temporary credentials");
  }

  if (
    !Credentials.AccessKeyId ||
    !Credentials.SecretKey ||
    !Credentials.SessionToken
  ) {
    throw new Error("Incomplete AWS credentials");
  }

  const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: Credentials.AccessKeyId,
      secretAccessKey: Credentials.SecretKey,
      sessionToken: Credentials.SessionToken,
    },
  });

  return {
    docClient: DynamoDBDocumentClient.from(client),
    cognitoIdentityId: IdentityId,
  };
}

export async function getAccounts(): Promise<BankAccount[]> {
  try {
    const { docClient, cognitoIdentityId } = await createDynamoDBClient();

    const command = new QueryCommand({
      TableName: "BankAccounts",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": cognitoIdentityId,
      },
    });

    const response = await docClient.send(command);
    return response.Items as BankAccount[];
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw error;
    }
    console.error("Error in getAccounts:", error);
    throw new Error("Failed to fetch accounts");
  }
}

export async function getAccount(
  accountId: string
): Promise<BankAccount | null> {
  try {
    const { docClient, cognitoIdentityId } = await createDynamoDBClient();

    const command = new GetCommand({
      TableName: "BankAccounts",
      Key: {
        userId: cognitoIdentityId,
        accountId,
      },
    });

    const response = await docClient.send(command);

    const account = response.Item as BankAccount | null;

    if (account) {
      // Precompute formattedTimestamp for each transaction
      account.transactions = account.transactions.map((transaction) => ({
        ...transaction,
        formattedTimestamp: new Date(transaction.timestamp).toLocaleDateString(
          "en-US"
        ),
      }));
    }

    return account;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw error;
    }
    console.error("Error in getAccount:", error);
    throw new Error("Failed to fetch account");
  }
}

export async function createAccount(name: string): Promise<BankAccount> {
  try {
    const { docClient, cognitoIdentityId } = await createDynamoDBClient();

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

export async function updateInterestRate(
  accountId: string,
  newInterestRate: number
): Promise<BankAccount> {
  try {
    const { docClient, cognitoIdentityId } = await createDynamoDBClient();

    const command = new UpdateCommand({
      TableName: "BankAccounts",
      Key: {
        userId: cognitoIdentityId,
        accountId,
      },
      UpdateExpression: "SET interestRate = :newInterestRate",
      ExpressionAttributeValues: {
        ":newInterestRate": newInterestRate,
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

export async function addTransaction(
  accountId: string,
  transaction: Omit<
    Transaction,
    "transactionId" | "timestamp" | "runningBalance" | "accumulatedInterest"
  >,
  transactionTimestamp: string
): Promise<BankAccount> {
  try {
    const { docClient, cognitoIdentityId } = await createDynamoDBClient();

    const account = await getAccount(accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    // Calculate accumulated interest up to this point
    const sortedTransactions = [...account.transactions].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const {interestSinceLastTransaction} = calculateInterestSinceLastTransaction(
      account.interestRate,
      sortedTransactions
    );

    let lastBalance = 0;

    if (sortedTransactions && sortedTransactions.length > 0) {
      lastBalance = sortedTransactions[0].runningBalance || 0;
    }

    // const lastBalance : number = sortedTransactions[0].runningBalance || 0;

    // Calculate the new running balance including the new transaction
    const newTransactionAmount : number =
      transaction.type === "deposit" ? transaction.amount : -transaction.amount;
    const newRunningBalance =
      lastBalance + newTransactionAmount + interestSinceLastTransaction;

    const newTransaction: Transaction = {
      transactionId: uuidv4(),
      ...transaction,
      timestamp: transactionTimestamp,
      runningBalance: newRunningBalance,
      accumulatedInterest: interestSinceLastTransaction,
    };
    const command = new UpdateCommand({
      TableName: "BankAccounts",
      Key: {
        userId: cognitoIdentityId,
        accountId,
      },
      UpdateExpression:
        "SET balance = :amount, transactions = list_append(if_not_exists(transactions, :empty_list), :transaction)",
      ExpressionAttributeValues: {
        ":amount": newRunningBalance,
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
