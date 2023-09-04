import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { MakeQuestion } from "test/factories/make-question";
import { DeleteQuestionUseCase } from "./delete-question";
import { UniqueEntityID } from "../../enterprise/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allow-error";

let inMemoryQuestionsRepo: InMemoryQuestionsRepository;
let sut: DeleteQuestionUseCase;

describe("Delete Question", () => {
  beforeEach(() => {
    inMemoryQuestionsRepo = new InMemoryQuestionsRepository();
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepo);
  });

  it("should be able to delete a question", async () => {
    const newQuestion = MakeQuestion(
      { authorId: new UniqueEntityID("author-1") },
      new UniqueEntityID("question-1"),
    );

    await inMemoryQuestionsRepo.create(newQuestion);

    await sut.execute({
      authorId: "author-1",
      questionId: "question-1",
    });

    expect(inMemoryQuestionsRepo.items).toHaveLength(0);
  });

  it("should not be able to delete a question from another user", async () => {
    const newQuestion = MakeQuestion(
      { authorId: new UniqueEntityID("author-1") },
      new UniqueEntityID("question-1"),
    );

    await inMemoryQuestionsRepo.create(newQuestion);

    const result = await sut.execute({
      authorId: "author-2",
      questionId: "question-1",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
