import { agent, ContextChatEngine, Metadata, NodeWithScore, RetrieveParams, VectorIndexRetriever } from "llamaindex";
import { getIndex } from "./data";
import { Settings } from "llamaindex";

class DebugVectorIndexRetriever extends VectorIndexRetriever {
  async retrieve(params: RetrieveParams): Promise<NodeWithScore[]> {
    const nodes : NodeWithScore<Metadata>[] = await super.retrieve(params);

    console.log("retrieved nodes", nodes);

    return nodes;
  }
}

export const chatEngineFactory = async (prompt: string) => {
  const index = await getIndex(prompt);

  // TODO: make the debug retriever optional, using this as the default:
  // const myRetriever = index.asRetriever({
  //   similarityTopK: 3,
  // });

  const myRetriever : DebugVectorIndexRetriever = new DebugVectorIndexRetriever({
    index,
    similarityTopK: 3,
  });
  

  console.log("system prompt: ", process.env.SYSTEM_PROMPT);

  const chatEngine = new ContextChatEngine( {
    chatModel: Settings.llm,
    retriever: myRetriever,
    systemPrompt: process.env.SYSTEM_PROMPT,
  });

  return chatEngine;

};
