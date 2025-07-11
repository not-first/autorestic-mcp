
import { z } from 'zod';

export const BackendsSchema = z.record(z.object({
  type: z.string().describe("Exact backend_id reference name retrieved from 'list-backends' "),
}));

export type Backends = z.infer<typeof BackendsSchema>;

export interface ResticStats {
  total_size: number;
  total_file_count: number;
  snapshots_count: number;
}
