import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";
import { MakeQuestion } from "test/factories/make-question";
import { Slug } from "../../enterprise/entities/value-objects/slug";

let inMemoryQuestionsRepo: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe("Get Question By Slug", () => {
  beforeEach(() => {
    inMemoryQuestionsRepo = new InMemoryQuestionsRepository();
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepo);
  });

  it("should be able to get a question by slug", async () => {
    const newQuestion = MakeQuestion({
      slug: Slug.create("example-question"),
    });

    await inMemoryQuestionsRepo.create(newQuestion);

    const { question } = await sut.execute({
      slug: "example-question",
    });

    expect(question.id).toBeTruthy();
    expect(question.title).toEqual(newQuestion.title);
  });
});
