import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as _cluster from 'cluster';
import { cpus } from 'os';

const cluster = _cluster as unknown as _cluster.Cluster; // typings fix

@Injectable()
export class AppClusterService {
  static clusterize(bootstrap: any): void {
    if (cluster.isPrimary) {
      const configService = new ConfigService();
      const isProduction =
        configService.get<string>('NODE_ENV') === 'production';
      const numCPUs: number = isProduction ? cpus().length : 1;
      console.log(
        `Master server started on ${process.pid} with ${numCPUs} ${isProduction ? 'CPU (Production mode)' : 'CPU (Development mode)'}`,
      );
      for (let i = 0; i < numCPUs; i++) cluster.fork();
      cluster.on('exit', () => cluster.fork());
      return;
    } else {
      console.log(`Cluster server started on ${process.pid}`);
      bootstrap();
    }
  }
}
