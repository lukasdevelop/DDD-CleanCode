import { MakeAnswerComment } from "test/factories/make-answer-comment";
import { UniqueEntityID } from "../../enterprise/entities/unique-entity-id";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";

let inMemoryAnswerCommentsRepo: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe("Fetch Answer Comments", () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepo = new InMemoryAnswerCommentsRepository();
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepo);
  });

  it("should be able to fetch answer comments", async () => {
    await inMemoryAnswerCommentsRepo.create(
      MakeAnswerComment({
        answerId: new UniqueEntityID("answer-1"),
      }),
    );

    await inMemoryAnswerCommentsRepo.create(
      MakeAnswerComment({
        answerId: new UniqueEntityID("answer-1"),
      }),
    );

    await inMemoryAnswerCommentsRepo.create(
      MakeAnswerComment({
        answerId: new UniqueEntityID("answer-1"),
      }),
    );

    const result = await sut.execute({
      answerId: "answer-1",
      page: 1,
    });

    expect(result.value?.answerComments).toHaveLength(3);
  });
});

it("should be able to fetch paginated answer comments", async () => {
  for (let i = 1; i <= 22; i++) {
    await inMemoryAnswerCommentsRepo.create(
      MakeAnswerComment({
        answerId: new UniqueEntityID("answer-1"),
      }),
    );
  }

  const result = await sut.execute({
    answerId: "answer-1",
    page: 2,
  });

  expect(result.value?.answerComments).toHaveLength(5);
});
