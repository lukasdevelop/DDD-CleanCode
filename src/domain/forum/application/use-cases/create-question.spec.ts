import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { CreateQuestionUseCase } from "./create-question";

let inMemoryQuestionsRepo: InMemoryQuestionsRepository;
let sut: CreateQuestionUseCase;

describe("Create Question", () => {
  beforeEach(() => {
    inMemoryQuestionsRepo = new InMemoryQuestionsRepository();
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepo);
  });

  it("create a question", async () => {
    const { question } = await sut.execute({
      authorId: "1",
      title: "Nova pergunta",
      content: "Conteúdo da pergunta",
    });

    expect(question.id).toBeTruthy();
    expect(inMemoryQuestionsRepo.items[0].id).toEqual(question.id);
  });
});
