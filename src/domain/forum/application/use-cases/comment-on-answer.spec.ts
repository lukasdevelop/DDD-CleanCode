import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { MakeAnswer } from "test/factories/make-answer";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { CommentOnAnswerUseCase } from "./comment-on-answer";

let inMemoryAnswersRepo: InMemoryAnswersRepository;
let inMemoryAnswerCommentsRepo: InMemoryAnswerCommentsRepository;
let sut: CommentOnAnswerUseCase;

describe("Comment on answer", () => {
  beforeEach(() => {
    inMemoryAnswersRepo = new InMemoryAnswersRepository();
    inMemoryAnswerCommentsRepo = new InMemoryAnswerCommentsRepository();

    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepo,
      inMemoryAnswerCommentsRepo,
    );
  });

  it("should be able to comment on answer", async () => {
    const answer = MakeAnswer();

    await inMemoryAnswersRepo.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: "Comentario teste",
    });

    expect(inMemoryAnswerCommentsRepo.items[0].content).toEqual(
      "Comentario teste",
    );
  });
});
