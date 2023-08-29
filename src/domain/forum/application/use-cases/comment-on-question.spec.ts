import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { MakeQuestion } from "test/factories/make-question";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { CommentOnQuestionUseCase } from "./comment-on-question";

let inMemoryQuestionsRepo: InMemoryQuestionsRepository;
let inMemoryQuestionCommentsRepo: InMemoryQuestionCommentsRepository;
let sut: CommentOnQuestionUseCase;

describe("Comment on questin", () => {
  beforeEach(() => {
    inMemoryQuestionsRepo = new InMemoryQuestionsRepository();
    inMemoryQuestionCommentsRepo = new InMemoryQuestionCommentsRepository();

    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepo,
      inMemoryQuestionCommentsRepo,
    );
  });

  it("should be able to comment on question", async () => {
    const question = MakeQuestion();

    await inMemoryQuestionsRepo.create(question);

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: "Comentario teste",
    });

    expect(inMemoryQuestionCommentsRepo.items[0].content).toEqual(
      "Comentario teste",
    );
  });
});
