
import { z } from 'zod';

export interface ResticStats {
  total_size: number;
  total_file_count: number;
  snapshots_count: number;
}
