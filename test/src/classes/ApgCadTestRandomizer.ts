/** -----------------------------------------------------------------------
 * @module [Cad/Test]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.6 [APG 2023/03/13]
 * -----------------------------------------------------------------------
*/

import { A2D,} from "../../../deps.ts";


export class ApgCadTestRandomizer {

  private _bottomLeft = new A2D.Apg2DPoint(0, 0);
  private _topRight = new A2D.Apg2DPoint(1, 1);

  private _minRange = 0;
  private _maxRange = 1;

  private _minN = 0;
  private _maxN = 1;


  setMinMaxN(amin: number, amax: number) {
    this._minN = amin;
    this._maxN = amax;
  }

  setMinMaxRange(amin: number, amax: number) {
    this._minRange = amin;
    this._maxRange = amax;
  }

  setMinMaxPoint(aminx: number, aminy: number, amaxx: number, amaxy: number,) {
    this._bottomLeft = new A2D.Apg2DPoint(aminx, aminy);
    this._topRight = new A2D.Apg2DPoint(amaxx, amaxy);
  }

  randomNum(aminVal: number, amaxVal: number) {
    return Math.random() * (amaxVal - aminVal) + aminVal;
  }

  randomInRange() {
    return this.randomNum(this._minRange, this._maxRange);
  }

  randomIntInRange() {
    return this.randomInt(this._minRange, this._maxRange);
  }

  randomInt(aminVal: number, amaxVal: number) {
    return Math.round(Math.random() * (amaxVal - aminVal)) + aminVal;
  }

  randomN() {
    return this.randomInt(this._minN, this._maxN);
  }

  randomIntPoint() {
    const cx = this.randomInt(this._bottomLeft.x, this._topRight.x);
    const cy = this.randomInt(this._bottomLeft.y, this._topRight.y);
    const r = new A2D.Apg2DPoint(cx, cy);
    return r;
  }

  randomPoint() {
    const cx = this.randomNum(this._bottomLeft.x, this._topRight.x);
    const cy = this.randomNum(this._bottomLeft.y, this._topRight.y);
    const r = new A2D.Apg2DPoint(cx, cy);
    return r;
  }

}