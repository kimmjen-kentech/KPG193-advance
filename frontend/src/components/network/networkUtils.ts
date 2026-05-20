import type { NetworkBranch } from '../../lib/queries';

export const branchKey = (b: NetworkBranch) =>
  `${b.from_id}-${b.to_id}-${b.kv}-${b.rate_mva}`;

export const busLabel = (id: number, name: string) =>
  `#${String(id).padStart(3, '0')}. ${name}`;
