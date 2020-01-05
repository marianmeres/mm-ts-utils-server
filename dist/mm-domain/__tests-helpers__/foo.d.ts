import { Service } from '../Service';
import { BaseModel } from 'mm-ts-utils';
import { SqlUtil } from '../../mm-sql/SqlUtil';
export interface BaseFooData {
    id: any;
    label?: string;
}
export declare class BaseFoo extends BaseModel<BaseFooData> {
    readonly entityType = "foo";
    get label(): any;
    set label(v: any);
    get bar(): string;
    get _defaults(): BaseFooData;
    static defaults(): BaseFooData;
}
export declare const fooService: (db?: SqlUtil) => FooService;
declare class FooService extends Service<BaseFoo> {
    protected _tableName: string;
    protected _modelCtor: typeof BaseFoo;
}
export {};
