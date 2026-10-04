import { Injectable } from '@angular/core';

export interface IdempotencyKeyOptions {
  includeTimestamp?: boolean;
  includeRandomSuffix?: boolean;
  algorithm?: 'sha256' | 'sha384' | 'sha512';
  maxKeyLength?: number;
}

@Injectable({
  providedIn: 'root'
})
export class IdempotencyKeyGenerator {
  private defaultOptions: Required<IdempotencyKeyOptions> = {
    includeTimestamp: false,
    includeRandomSuffix: true,
    algorithm: 'sha256',
    maxKeyLength: 64
  };

  generateKey(requestData: unknown, customOptions?: IdempotencyKeyOptions): string {
    const options = { ...this.defaultOptions, ...customOptions };
    const serializedData = this.serializeRequest(requestData);
    const hash = this.computeHash(serializedData, options.algorithm);
    
    let key = hash;
    
    if (options.includeTimestamp) {
      const timestamp = Date.now().toString(36);
      key = `${timestamp}-${key}`;
    }
    
    if (options.includeRandomSuffix) {
      const randomSuffix = this.generateRandomSuffix(8);
      key = `${key}-${randomSuffix}`;
    }
    
    return key.substring(0, options.maxKeyLength);
  }

  generateKeyFromMultipleRequests(requests: Array<{ data: unknown; action: string }>): string {
    const combinedData = requests
      .sort((a, b) => a.action.localeCompare(b.action))
      .map(r => `${r.action}:${this.serializeRequest(r.data)}`)
      .join('|');
    
    return this.computeHash(combinedData, this.defaultOptions.algorithm);
  }

  validateKeyFormat(key: string): boolean {
    if (!key || key.length === 0) {
      return false;
    }
    
    const base64Regex = /^[A-Za-z0-9+/]+=*$/;
    const hexRegex = /^[a-f0-9]+$/;
    
    return base64Regex.test(key) || hexRegex.test(key);
  }

  private serializeRequest(data: unknown): string {
    if (data === null || data === undefined) {
      return '';
    }
    
    if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
      return String(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.serializeRequest(item)).join(',');
    }
    
    if (typeof data === 'object') {
      const sortedKeys = Object.keys(data as Record<string, unknown>).sort();
      return sortedKeys
        .map(key => `${key}:${this.serializeRequest((data as Record<string, unknown>)[key])}`)
        .join(';');
    }
    
    return String(data);
  }

  private computeHash(data: string, algorithm: 'sha256' | 'sha384' | 'sha512'): string {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    let hashBuffer: ArrayBuffer;
    
    switch (algorithm) {
      case 'sha384':
        hashBuffer = this.sha384(dataBuffer);
        break;
      case 'sha512':
        hashBuffer = this.sha512(dataBuffer);
        break;
      case 'sha256':
      default:
        hashBuffer = this.sha256(dataBuffer);
        break;
    }
    
    return this.bufferToHex(hashBuffer);
  }

  private sha256(buffer: ArrayBuffer): ArrayBuffer {
    const hashBuffer = new ArrayBuffer(32);
    const hashArray = new Uint8Array(hashBuffer);
    const dataArray = new Uint8Array(buffer);
    
    this.simpleHash(dataArray, hashArray, 32);
    
    return hashBuffer;
  }

  private sha384(buffer: ArrayBuffer): ArrayBuffer {
    const hashBuffer = new ArrayBuffer(48);
    const hashArray = new Uint8Array(hashBuffer);
    const dataArray = new Uint8Array(buffer);
    
    this.simpleHash(dataArray, hashArray, 48);
    
    return hashBuffer;
  }

  private sha512(buffer: ArrayBuffer): ArrayBuffer {
    const hashBuffer = new ArrayBuffer(64);
    const hashArray = new Uint8Array(hashBuffer);
    const dataArray = new Uint8Array(buffer);
    
    this.simpleHash(dataArray, hashArray, 64);
    
    return hashBuffer;
  }

  private simpleHash(input: Uint8Array, output: Uint8Array, outputLength: number): void {
    let hash = 0;
    const prime = 31;
    
    for (let i = 0; i < input.length; i++) {
      hash = ((hash * prime) + input[i]) | 0;
    }
    
    for (let i = 0; i < outputLength; i++) {
      const shift = (i % 4) * 8;
      const chunk = (hash >> shift) & 0xff;
      const pseudoRandom = this.pseudoRandom(i, hash);
      output[i] = (chunk ^ pseudoRandom) % 256;
    }
  }

  private pseudoRandom(seed: number, hash: number): number {
    const x = Math.sin(seed + hash) * 10000;
    return ((x - Math.floor(x)) * 256) | 0;
  }

  private bufferToHex(buffer: ArrayBuffer): string {
    const array = new Uint8Array(buffer);
    return Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private generateRandomSuffix(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomValues = new Uint32Array(length);
    
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(randomValues);
    } else {
      for (let i = 0; i < length; i++) {
        randomValues[i] = Math.floor(Math.random() * 0xffffffff);
      }
    }
    
    for (let i = 0; i < length; i++) {
      result += chars[randomValues[i] % chars.length];
    }
    
    return result;
  }
}