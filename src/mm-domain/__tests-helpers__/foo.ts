import { Service } from '../Service';
import { BaseModel } from 'mm-ts-utils';
import { SqlUtil } from '../../mm-sql/SqlUtil';

export interface BaseFooData {
    id: any;
    label?: string;
}

export class BaseFoo extends BaseModel<BaseFooData> {
    readonly entityType = 'foo';

    get label() {
        return this._get('label');
    }
    set label(v) {
        this._set('label', v);
    }

    get bar() {
        return 'baz';
    }

    get _defaults(): BaseFooData {
        return BaseFoo.defaults();
    }

    static defaults(): BaseFooData {
        return Object.assign({}, BaseModel.defaults(), {
            label: null,
        });
    }
}

// exposed factory
export const fooService = (db?: SqlUtil) => new FooService(db);

class FooService extends Service<BaseFoo> {
    protected _tableName: string = 'foo';

    protected _modelCtor = BaseFoo;
}

export const fooAdvService = (db?: SqlUtil) => new FooAdvService(db);
class FooAdvService extends FooService {
    protected _isDeletedColName = 'is_deleted';
}
