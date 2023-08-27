import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { MakeAnswer } from "test/factories/make-answer";
import { EditAnswerUseCase } from "./edit-answer";
import { UniqueEntityID } from "../../enterprise/entities/unique-entity-id";

let inMemoryAnswersRepo: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe("Edit Answer", () => {
  beforeEach(() => {
    inMemoryAnswersRepo = new InMemoryAnswersRepository();
    sut = new EditAnswerUseCase(inMemoryAnswersRepo);
  });

  it("should be able to edit a answer", async () => {
    const newAnswer = MakeAnswer(
      { authorId: new UniqueEntityID("author-1") },
      new UniqueEntityID("answer-1"),
    );

    await inMemoryAnswersRepo.create(newAnswer);

    await sut.execute({
      answerId: newAnswer.id.toValue(),
      authorId: "author-1",
      content: "Conteudo teste",
    });

    expect(inMemoryAnswersRepo.items[0]).toMatchObject({
      content: "Conteudo teste",
    });
  });

  it("should not be able to edit a answer from another user", async () => {
    const newAnswer = MakeAnswer(
      { authorId: new UniqueEntityID("author-1") },
      new UniqueEntityID("answer-1"),
    );

    await inMemoryAnswersRepo.create(newAnswer);

    expect(() => {
      return sut.execute({
        answerId: newAnswer.id.toValue(),
        authorId: "author-2",
        content: "Conteudo teste",
      });
    }).rejects.toBeInstanceOf(Error);
  });
});
