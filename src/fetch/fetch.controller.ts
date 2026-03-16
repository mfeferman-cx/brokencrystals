import { Controller, Get, Logger, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import { HttpClientService } from '../httpclient/httpclient.service';

@ApiTags('Fetch controller')
@Controller('/api/fetch')
export class FetchController {
  private readonly logger = new Logger(FetchController.name);

  constructor(private readonly httpClient: HttpClientService) {}

  @Get()
  @ApiQuery({
    name: 'url',
    example: 'https://example.com',
    required: true,
    description: 'URL to fetch content from'
  })
  @ApiOperation({
    description:
      'Fetches content from the specified URL. No validation is performed on the URL parameter.'
  })
  @ApiOkResponse({
    description: 'Returns the fetched content',
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string' },
        contentType: { type: 'string' }
      }
    }
  })
  async fetchUrl(@Query('url') url: string): Promise<{
    content: string;
    contentType: string;
  }> {
    this.logger.debug(`Fetching URL: ${url}`);
    try {
      const result = await this.httpClient.loadAny(url);
      return {
        content: result.content.toString('utf-8'),
        contentType: result.contentType
      };
    } catch (err) {
      this.logger.error(`Failed to fetch URL: ${err.message}`);
      return {
        content: `Error: ${err.message}`,
        contentType: 'text/plain'
      };
    }
  }
}
