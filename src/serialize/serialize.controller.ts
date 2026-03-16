import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Serialize controller')
@Controller('/api/serialize')
export class SerializeController {
  private readonly logger = new Logger(SerializeController.name);

  @Post()
  @ApiBody({
    description: 'JSON object to serialize/evaluate',
    schema: {
      type: 'object',
      additionalProperties: true,
      example: {
        data: '{ "message": "test" }'
      }
    }
  })
  @ApiOperation({
    description:
      'Serializes and evaluates the provided JavaScript object. The input is parsed and executed without proper validation, making it vulnerable to insecure deserialization attacks.'
  })
  @ApiOkResponse({
    description: 'Returns the evaluated result',
    schema: {
      type: 'object',
      properties: {
        result: { type: 'string' },
        type: { type: 'string' }
      }
    }
  })
  async serialize(@Body() body: { data: string }): Promise<{
    result: string;
    type: string;
  }> {
    this.logger.debug(`Processing serialized data: ${body.data}`);

    try {
      // Vulnerability: Insecure deserialization - directly evaluating JSON data
      // This simulates unsafe deserialization patterns

      // First, parse the JSON (this is where vulnerable deserialization could occur)
      const parsed = JSON.parse(body.data);

      // Vulnerability: Using eval to "process" the serialized data
      // In real attacks, this could execute malicious code
      // We demonstrate with a safe eval but the pattern is vulnerable

      // Check if the parsed object contains executable patterns
      // This is a simulation of insecure deserialization
      let result: string;
      let resultType: string;

      if (typeof parsed === 'object' && parsed !== null) {
        // Simulate insecure deserialization by converting back to string
        // and potentially executing
        const serialized = JSON.stringify(parsed);

        // Vulnerability demonstration: directly using data in eval-like pattern
        // In a real attack, this could be used for RCE
        if (serialized.includes('__') || serialized.includes('constructor')) {
          this.logger.warn(
            'Potentially malicious serialization pattern detected'
          );
        }

        // Using Function constructor as a simplified "eval" alternative
        // to demonstrate the vulnerability pattern
        const fn = new Function('return ' + serialized);
        const evaluated = fn();

        result = JSON.stringify(evaluated);
        resultType = typeof evaluated;
      } else {
        result = String(parsed);
        resultType = typeof parsed;
      }

      this.logger.debug(`Serialization result: ${result}`);

      return {
        result,
        type: resultType
      };
    } catch (err) {
      this.logger.error(`Failed to serialize: ${err.message}`);
      return {
        result: `Error: ${err.message}`,
        type: 'error'
      };
    }
  }
}
