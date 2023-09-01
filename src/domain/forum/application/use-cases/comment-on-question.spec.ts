import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { DeleteQuestionCommentUseCase } from "./delete-question-comment";
import { MakeQuestionCommentComment } from "test/factories/make-question-comment";
import { UniqueEntityID } from "../../enterprise/entities/unique-entity-id";

let inMemoryQuestionCommentsRepo: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe("Delete question commment", () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepo = new InMemoryQuestionCommentsRepository();
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepo);
  });

  it("should be able to comment on question", async () => {
    const questionComment = MakeQuestionCommentComment();

    await inMemoryQuestionCommentsRepo.create(questionComment);

    await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    });

    expect(inMemoryQuestionCommentsRepo.items).toHaveLength(0);
  });

  it("should not be able to delete another user question comment", async () => {
    const questionComment = MakeQuestionCommentComment({
      authorId: new UniqueEntityID("author-1"),
    });

    await inMemoryQuestionCommentsRepo.create(questionComment);

    expect(() => {
      return sut.execute({
        questionCommentId: questionComment.id.toString(),
        authorId: "author-2",
      });
    }).rejects.toBeInstanceOf(Error);
  });
});
