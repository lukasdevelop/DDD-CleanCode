import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { MakeQuestion } from "test/factories/make-question";
import { EditQuestionUseCase } from "./edit-question";
import { UniqueEntityID } from "../../enterprise/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allow-error";

let inMemoryQuestionsRepo: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

describe("Edit Question", () => {
  beforeEach(() => {
    inMemoryQuestionsRepo = new InMemoryQuestionsRepository();
    sut = new EditQuestionUseCase(inMemoryQuestionsRepo);
  });

  it("should be able to edit a question", async () => {
    const newQuestion = MakeQuestion(
      { authorId: new UniqueEntityID("author-1") },
      new UniqueEntityID("question-1"),
    );

    await inMemoryQuestionsRepo.create(newQuestion);

    await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: "author-1",
      title: "Pergunta teste",
      content: "Conteudo teste",
    });

    expect(inMemoryQuestionsRepo.items[0]).toMatchObject({
      title: "Pergunta teste",
      content: "Conteudo teste",
    });
  });

  it("should not be able to edit a question from another user", async () => {
    const newQuestion = MakeQuestion(
      { authorId: new UniqueEntityID("author-1") },
      new UniqueEntityID("question-1"),
    );

    await inMemoryQuestionsRepo.create(newQuestion);

    const result = await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: "author-2",
      title: "Pergunta teste",
      content: "Conteudo teste",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
