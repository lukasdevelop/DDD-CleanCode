import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { MakeQuestion } from "test/factories/make-question";
import { FetchRecentQuestionsUseCase } from "./fetch-recents-questions";

let inMemoryQuestionsRepo: InMemoryQuestionsRepository;
let sut: FetchRecentQuestionsUseCase;

describe("Fetch Recent Questions", () => {
  beforeEach(() => {
    inMemoryQuestionsRepo = new InMemoryQuestionsRepository();
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepo);
  });

  it("should be able to fetch paginated recent questions", async () => {
    await inMemoryQuestionsRepo.create(
      MakeQuestion({ createdAt: new Date(2022, 0, 20) }),
    );
    await inMemoryQuestionsRepo.create(
      MakeQuestion({ createdAt: new Date(2022, 0, 18) }),
    );
    await inMemoryQuestionsRepo.create(
      MakeQuestion({ createdAt: new Date(2022, 0, 23) }),
    );

    const { questions } = await sut.execute({
      page: 1,
    });

    expect(questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ]);
  });

  it("should be able to fetch recent questions", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsRepo.create(MakeQuestion());
    }

    const { questions } = await sut.execute({
      page: 2,
    });

    expect(questions).toHaveLength(2);
  });
});
