/* eslint-disable prettier/prettier */
import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export class InMemoryAnswerCommentsRepository
implements AnswerCommentsRepository
{
  public items: AnswerComment[] = [];

  async findById(id: string): Promise<AnswerComment | null> {
    const answercomment = this.items.find((item) => item.id.toString() === id);

    if (!answercomment) {
      return null;
    }

    return answercomment;
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20);

    return answerComments;
  }

  async delete(answercomment: AnswerComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answercomment.id,
    );
    this.items.splice(itemIndex, 1);
  }

  async create(answercomment: AnswerComment) {
    this.items.push(answercomment);
  }
}
