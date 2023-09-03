import { UniqueEntityID } from "../../enterprise/entities/unique-entity-id";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { DeleteQuestionCommentUseCase } from "./delete-question-comment";
import { MakeQuestionComment } from "test/factories/make-question-comment";

let inMemoryQuestionCommentRepo: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe("Delete Question Comment", () => {
  beforeEach(() => {
    inMemoryQuestionCommentRepo = new InMemoryQuestionCommentsRepository();
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentRepo);
  });

  it("should be able to delete a question comment", async () => {
    const questionComment = MakeQuestionComment();

    await inMemoryQuestionCommentRepo.create(questionComment);

    await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    });

    expect(inMemoryQuestionCommentRepo.items).toHaveLength(0);
  });

  it("should not be able to delete another user answer comment", async () => {
    const questionComment = MakeQuestionComment({
      authorId: new UniqueEntityID("author-1"),
    });

    await inMemoryQuestionCommentRepo.create(questionComment);

    expect(() => {
      return sut.execute({
        authorId: "author-2",
        questionCommentId: questionComment.questionId.toString(),
      });
    }).rejects.toBeInstanceOf(Error);
  });
});
