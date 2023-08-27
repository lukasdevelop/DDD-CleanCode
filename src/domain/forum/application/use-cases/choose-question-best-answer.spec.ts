import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { MakeQuestion } from "test/factories/make-question";
import { UniqueEntityID } from "../../enterprise/entities/unique-entity-id";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";
import { MakeAnswer } from "test/factories/make-answer";

let inMemoryQuestionsRepo: InMemoryQuestionsRepository;
let inMemoryAnswersRepo: InMemoryAnswersRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe("Choose Question Best Answer", () => {
  beforeEach(() => {
    inMemoryQuestionsRepo = new InMemoryQuestionsRepository();
    inMemoryAnswersRepo = new InMemoryAnswersRepository();

    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepo,
      inMemoryAnswersRepo,
    );
  });

  it("should be able to choose the question best answer", async () => {
    const question = MakeQuestion();

    const answer = MakeAnswer({
      questionId: question.id,
    });

    await inMemoryQuestionsRepo.create(question);
    await inMemoryAnswersRepo.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    });

    expect(inMemoryQuestionsRepo.items[0].bestAnswerId).toEqual(answer.id);
  });

  it("should not be able to choose another user question best answer ", async () => {
    const question = MakeQuestion({
      authorId: new UniqueEntityID("author-1"),
    });

    const answer = MakeAnswer({
      questionId: question.id,
    });

    await inMemoryQuestionsRepo.create(question);
    await inMemoryAnswersRepo.create(answer);

    expect(() => {
      return sut.execute({
        answerId: answer.id.toString(),
        authorId: "author-2",
      });
    }).rejects.toBeInstanceOf(Error);
  });
});
