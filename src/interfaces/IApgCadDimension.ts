/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.4 [APG 2023/01/06] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */
import { A2D } from "../../deps.ts";

/**
 * Dimension data
 */
export interface IApgCadDimension {

  firstP: A2D.Apg2DPoint;
  secondP: A2D.Apg2DPoint;

  p1: A2D.Apg2DPoint;
  p2: A2D.Apg2DPoint;

  displacement?: number;

  pointsLine?: A2D.Apg2DLine;

  ladderStart1?: A2D.Apg2DPoint;
  ladderStart2?: A2D.Apg2DPoint;

  ladderAdditional?: A2D.Apg2DPoint;

  arrow1Pos?: A2D.Apg2DPoint;
  arrow2Pos?: A2D.Apg2DPoint;

  dimLine?: A2D.Apg2DLine;

  value: number;
  dimension: string;

  textBasePoint?: A2D.Apg2DPoint;

  textOrientation?: number;
  arrowOrientation?: number;
  textLineSpacing?: number;


  textPoint?: A2D.Apg2DPoint;
}
