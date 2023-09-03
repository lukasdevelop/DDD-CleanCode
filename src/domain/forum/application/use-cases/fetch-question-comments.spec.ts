import { MakeQuestionComment } from "test/factories/make-question-comment";
import { UniqueEntityID } from "../../enterprise/entities/unique-entity-id";
import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";

let inMemoryQuestionCommentsRepo: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe("Fetch Question Comments", () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepo = new InMemoryQuestionCommentsRepository();
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepo);
  });

  it("should be able to fetch question comments", async () => {
    await inMemoryQuestionCommentsRepo.create(
      MakeQuestionComment({
        questionId: new UniqueEntityID("question-1"),
      }),
    );

    await inMemoryQuestionCommentsRepo.create(
      MakeQuestionComment({
        questionId: new UniqueEntityID("question-1"),
      }),
    );

    await inMemoryQuestionCommentsRepo.create(
      MakeQuestionComment({
        questionId: new UniqueEntityID("question-1"),
      }),
    );

    const { questionComments } = await sut.execute({
      questionId: "question-1",
      page: 1,
    });

    expect(questionComments).toHaveLength(3);
  });
});

it("should be able to fetch paginated question comments", async () => {
  for (let i = 1; i <= 22; i++) {
    await inMemoryQuestionCommentsRepo.create(
      MakeQuestionComment({
        questionId: new UniqueEntityID("question-1"),
      }),
    );
  }

  const { questionComments } = await sut.execute({
    questionId: "question-1",
    page: 2,
  });

  expect(questionComments).toHaveLength(5);
});