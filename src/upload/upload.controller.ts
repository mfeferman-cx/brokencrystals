import {
  Controller,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { DOMParser } from '@xmldom/xmldom';

@ApiTags('Upload controller')
@Controller('/api/upload')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  @Post('parse')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'XML file to parse',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @ApiOperation({
    description:
      'Parses uploaded XML file. The XML parser is configured to allow external entity processing, making it vulnerable to XXE attacks.'
  })
  @ApiOkResponse({
    description: 'Returns parsed XML content',
    schema: {
      type: 'object',
      properties: {
        parsed: { type: 'string' },
        content: { type: 'string' }
      }
    }
  })
  async parseXml(@UploadedFile() file: Express.Multer.File): Promise<{
    parsed: string;
    content: string;
  }> {
    this.logger.debug(`Parsing XML file: ${file?.originalname}`);

    if (!file) {
      return { parsed: 'No file uploaded', content: '' };
    }

    try {
      // Vulnerability: XML parser with external entity processing enabled
      // This is intentionally vulnerable for security testing
      const xmlContent = file.buffer.toString('utf-8');

      // Using xmldom which doesn't disable external entities by default
      // This makes it vulnerable to XXE attacks
      const parser = new DOMParser({
        errorHandler: {
          warning: (msg) => this.logger.warn(`XML Warning: ${msg}`),
          error: (msg) => this.logger.error(`XML Error: ${msg}`),
          fatalError: (msg) => this.logger.error(`XML Fatal: ${msg}`)
        }
        // Note: Not setting filter or disabling external entities
      });

      const doc = parser.parseFromString(xmlContent, 'text/xml');
      const parsed = doc.toString();

      this.logger.debug(`Parsed XML successfully`);

      return {
        parsed: parsed.substring(0, 2000), // Limit output size
        content: xmlContent
      };
    } catch (err) {
      this.logger.error(`Failed to parse XML: ${err.message}`);
      return {
        parsed: `Error: ${err.message}`,
        content: file.buffer.toString('utf-8')
      };
    }
  }
}
