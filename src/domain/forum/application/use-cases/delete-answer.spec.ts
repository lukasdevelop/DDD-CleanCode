import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { MakeAnswer } from "test/factories/make-answer";
import { DeleteAnswerUseCase } from "./delete-answer";
import { UniqueEntityID } from "../../enterprise/entities/unique-entity-id";

let inMemoryAnswersRepo: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe("Delete Answer", () => {
  beforeEach(() => {
    inMemoryAnswersRepo = new InMemoryAnswersRepository();
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepo);
  });

  it("should be able to delete a answer", async () => {
    const newAnswer = MakeAnswer(
      { authorId: new UniqueEntityID("author-1") },
      new UniqueEntityID("answer-1"),
    );

    await inMemoryAnswersRepo.create(newAnswer);

    await sut.execute({
      authorId: "author-1",
      answerId: "answer-1",
    });

    expect(inMemoryAnswersRepo.items).toHaveLength(0);
  });

  it("should not be able to delete a answer from another user", async () => {
    const newAnswer = MakeAnswer(
      { authorId: new UniqueEntityID("author-1") },
      new UniqueEntityID("answer-1"),
    );

    await inMemoryAnswersRepo.create(newAnswer);

    expect(() => {
      return sut.execute({
        authorId: "author-2",
        answerId: "answer-1",
      });
    }).rejects.toBeInstanceOf(Error);
  });
});
