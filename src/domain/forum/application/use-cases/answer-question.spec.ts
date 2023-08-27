import { AnswerQuestionUseCase } from "./answer-question";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";

let inMemoryAnswerRepo: InMemoryAnswersRepository;
let sut: AnswerQuestionUseCase;

describe("Create Answer", () => {
  beforeEach(() => {
    inMemoryAnswerRepo = new InMemoryAnswersRepository();
    sut = new AnswerQuestionUseCase(inMemoryAnswerRepo);
  });

  it("create a question", async () => {
    const { answer } = await sut.execute({
      questionId: "1",
      instructorId: "1",
      content: "Conteúdo da resposta",
    });

    expect(answer.id).toBeTruthy();
    expect(inMemoryAnswerRepo.items[0].id).toEqual(answer.id);
  });
});
