import { Host } from 'schematics-utilities';
import { Tree } from '@angular-devkit/schematics';

export class PathChangesBuffer implements Host {
  private _buffer:string|null = null;

  public get currentBuffer():string|null{
    return this._buffer;
  }

  constructor(private tree:Tree, private path:string) {
  }

  async write(path: string, content: string): Promise<void> {
    if(this.path?.toString()===path?.toString()) {
      this._buffer = content;
    }
  }
  async read(path: string): Promise<string> {
    if(!this._buffer && this.path?.toString()===path?.toString()) {
      this._buffer = this.tree.read(path)!.toString('utf-8');
    }
    return this._buffer || "";
  }
}