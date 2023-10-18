import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai"

import { config } from "../config"

const configuration = new Configuration({
  apiKey: config.openAI.apiToken,
})

export const openai = new OpenAIApi(configuration)

const maxRetries = 10;
const retryDelay = 5000;

export async function completion(
  messages: ChatCompletionRequestMessage[]
): Promise<string | undefined> {

  for (let retry = 0; retry < maxRetries; retry++) {
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0,
        max_tokens: 256,
        messages,
      })

      if (completion.status === 200) {
        console.log('Requisição bem-sucedida!');
        return completion.data.choices[0].message?.content
      }
    } catch (error) {
      console.error(`Tentativa ${retry + 1} falhou. Erro: ${error}`);
    }

    if (retry < maxRetries - 1) {
      console.log(`Tentando novamente após ${retryDelay / 1000} segundos...`);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    } else {
      console.error('Número máximo de tentativas excedido. Desistindo.');
    }
  }
  
}