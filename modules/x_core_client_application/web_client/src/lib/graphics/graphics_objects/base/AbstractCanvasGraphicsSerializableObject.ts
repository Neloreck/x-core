import { ISerializedGraphicsObject, TObjectPosition } from "../../types";

export abstract class AbstractCanvasGraphicsSerializableObject<T extends object> {

  public abstract config: T;
  protected abstract position: TObjectPosition | never;

  // Getters <-> Setters.

  public setPosition(position: TObjectPosition): void {
    this.position = position;
  }

  public getPosition(): TObjectPosition {
    return this.position;
  }

  public applyConfiguration(src: T | AbstractCanvasGraphicsSerializableObject<T>): void {
    if (src instanceof AbstractCanvasGraphicsSerializableObject) {
      this.config = Object.assign({}, this.config, src.config);
    } else {
      this.config = Object.assign({}, this.config, src as T);
    }
  }

  // Interaction.

  public serialize(): ISerializedGraphicsObject {
    return {
      className: this.constructor.name,
      configuration: JSON.stringify(this.config),
      position: JSON.stringify(this.position)
    };
  }

  public applySerialized(serialized: ISerializedGraphicsObject): void {
    this.config = JSON.parse(serialized.configuration);
    this.position = JSON.parse(serialized.position);
  }

}
