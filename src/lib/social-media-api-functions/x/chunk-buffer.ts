/**
 * Chunks a buffer into smaller pieces for media upload
 * @param buffer - The buffer to chunk
 * @param chunkSize - Size of each chunk in bytes (default: 1MB)
 * @returns Array of buffer chunks
 */
export function chunkBuffer(buffer: Buffer, chunkSize: number = 1024 * 1024): Buffer[] {
  const chunks: Buffer[] = [];
  const totalLength = buffer.length;
  
  for (let i = 0; i < totalLength; i += chunkSize) {
    const chunk = buffer.slice(i, Math.min(i + chunkSize, totalLength));
    chunks.push(chunk);
  }
  
  return chunks;
}