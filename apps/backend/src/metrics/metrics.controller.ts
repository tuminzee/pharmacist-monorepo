import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { ComparePrescriptionDtos } from './dto/compare-prescription.dto';
import { AuthGuard } from 'src/auth/auth.guard';
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @UseGuards(AuthGuard)
  @Post()
  compare(@Body() comparePrescriptionDtos: ComparePrescriptionDtos) {
    return this.metricsService.compare(comparePrescriptionDtos);
  }

  // @Get()
  // findAll() {
  //   return this.metricsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.metricsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMetricDto: UpdateMetricDto) {
  //   return this.metricsService.update(+id, updateMetricDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.metricsService.remove(+id);
  // }
}
