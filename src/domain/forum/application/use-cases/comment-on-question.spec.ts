import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { DeleteQuestionCommentUseCase } from "./delete-question-comment";
import { MakeQuestionCommentComment } from "test/factories/make-question-comment";

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
});
