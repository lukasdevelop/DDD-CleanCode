import { UniqueEntityID } from "../../enterprise/entities/unique-entity-id";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { DeleteAnswerCommentUseCase } from "./delete-answer-comment";
import { MakeAnswerComment } from "test/factories/make-answer-comment";

let inMemoryAnswerCommentRepo: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe("Delete Answer Comment", () => {
  beforeEach(() => {
    inMemoryAnswerCommentRepo = new InMemoryAnswerCommentsRepository();
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentRepo);
  });

  it("should be able to delete a answer comment", async () => {
    const answerComment = MakeAnswerComment();

    await inMemoryAnswerCommentRepo.create(answerComment);

    console.log(answerComment);

    await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    });

    expect(inMemoryAnswerCommentRepo.items).toHaveLength(0);
  });

  it("should not be able to delete another user answer comment", async () => {
    const answerComment = MakeAnswerComment({
      authorId: new UniqueEntityID("author-1"),
    });

    await inMemoryAnswerCommentRepo.create(answerComment);

    expect(() => {
      return sut.execute({
        authorId: "author-2",
        answerCommentId: answerComment.answerId.toString(),
      });
    }).rejects.toBeInstanceOf(Error);
  });
});
