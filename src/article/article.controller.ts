import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';
import { ZodValidationPipe } from '@app/pipes/zod-validation-pipe';
import { JwtAuthGuard } from '@app/auth/guard/jwtAuth.guard';
import { CurrentUser } from '@app/auth/currentUser.decorator';
import { TokenPayload } from '@app/auth/schemas/tokenPayloadSchema';
import {
  createArticleSchema,
  CreateArticleSchema,
} from '@app/article/schemas/createArticleSchema';
import { ArticleResponse } from '@app/article/schemas/articleResponseSchema';
import { DeleteResult } from 'typeorm';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async createArticle(
    @CurrentUser() userPayload: TokenPayload,
    @Body('article', new ZodValidationPipe(createArticleSchema))
    article: CreateArticleSchema,
  ): Promise<ArticleResponse> {
    return await this.articleService.createArticle(userPayload, article);
  }

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  async getArticle(@Param('slug') slug: string): Promise<ArticleResponse> {
    return await this.articleService.getArticle(slug);
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard)
  async deleteArticle(
    @Param('slug') slug: string,
    @CurrentUser() userPayload: TokenPayload,
  ): Promise<DeleteResult> {
    return await this.articleService.deleteArticle(slug, userPayload);
  }
}
