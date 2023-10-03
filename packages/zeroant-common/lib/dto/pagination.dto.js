import { InternalServerError } from 'zeroant-response/serverErrors/internalServerError.serverError';
import { ErrorCode, ErrorDescription } from '../constants.js';
import _ from 'lodash';
import crypto from 'node:crypto';
export class PaginationDto {
    count;
    sort = {};
    relations = {};
    filter = {};
    filterWhiteList = [];
    relationWhiteList = [];
    sortWhiteList = [];
    models = {};
    #page;
    #start;
    #limit = 10;
    static fromQuery(query, whiteList = {}) {
        return new PaginationDto()
            .setRelationWhiteList(...(whiteList?.relation ?? []))
            .setFilterWhiteList(...(whiteList?.filter ?? []))
            .setSortWhiteList(...(whiteList?.sort ?? []))
            .fromQuery(query);
    }
    fromQuery(query) {
        const page = Number(query?.page);
        const limit = Number(query?.limit);
        if (query?.start !== undefined || query?.start !== null) {
            this.setStart(Number(query?.start)).setLimit(limit);
        }
        else {
            this.setPage(page).setLimit(limit);
        }
        return this.setSortFromQuery(query.sort).setFilterFromQuery(query.filter).setRelationsFromQuery(query.relations);
    }
    setStart(start) {
        this.#start = start || 0;
        return this;
    }
    setPage(page) {
        page = Number(page);
        this.#page = page > 0 ? page : 1;
        return this;
    }
    setLimit(limit) {
        limit = Number(limit);
        this.#limit = limit > 0 ? limit : 10;
        return this;
    }
    setFilterWhiteList(...filterWhiteList) {
        this.filterWhiteList = filterWhiteList;
        return this;
    }
    setSortWhiteList(...sortWhiteList) {
        this.sortWhiteList = sortWhiteList;
        return this;
    }
    setRelationWhiteList(...relationWhiteList) {
        this.relationWhiteList = relationWhiteList;
        return this;
    }
    setSortFromQuery(query) {
        const sort = this.sort;
        if (Array.isArray(query)) {
            for (const field of query) {
                const [key, value = 'asc'] = field.split(':');
                const [findKey, replaceKey = undefined] = this.getWhitelist(this.sortWhiteList, key);
                if (findKey === key) {
                    sort[replaceKey ?? key] = value;
                }
            }
        }
        else if (typeof query === 'string') {
            const fields = query.split(',');
            for (const field of fields) {
                const [key, value = 'asc'] = field.split(':');
                const [findKey, replaceKey = undefined] = this.getWhitelist(this.sortWhiteList, key);
                if (findKey === key) {
                    sort[replaceKey ?? key] = value;
                }
            }
        }
        return this.setSort(sort);
    }
    setRelationsFromQuery(query) {
        const relations = this.relations;
        if (Array.isArray(query)) {
            for (const field of query) {
                const [findKey, replaceKey] = this.getWhitelist(this.relationWhiteList, field);
                if (field === findKey) {
                    _.set(relations, replaceKey ?? field, true);
                }
            }
        }
        else if (typeof query === 'string') {
            const fields = query.split(',');
            for (const field of fields) {
                const [findKey, replaceKey] = this.getWhitelist(this.relationWhiteList, field);
                if (field === findKey) {
                    _.set(relations, replaceKey ?? field, true);
                }
            }
        }
        return this.setRelations(relations);
    }
    getWhitelist(whiteList, key) {
        const [findKey, replaceKey = undefined] = (whiteList.find((findKey) => findKey === key || findKey.startsWith(key + ':')) ?? '').split(':');
        return [findKey, replaceKey];
    }
    setFilterFromQuery(query) {
        const filter = this.filter;
        if (Array.isArray(query)) {
            for (const field of query) {
                const [key, value = undefined] = field.split(':');
                const [findKey, replaceKey = undefined] = this.getWhitelist(this.filterWhiteList, key);
                if (findKey === key && value !== undefined) {
                    _.set(filter, replaceKey ?? findKey, value);
                }
            }
        }
        else if (typeof query === 'string') {
            const fields = query.split(',');
            for (const field of fields) {
                const [key, value = undefined] = field.split(':');
                const [findKey, replaceKey = undefined] = this.getWhitelist(this.filterWhiteList, key);
                if (findKey === key && value !== undefined) {
                    _.set(filter, replaceKey ?? findKey, value);
                }
            }
        }
        return this.setFilter(filter);
    }
    setSort(sort) {
        this.sort = sort;
        return this;
    }
    setFilter(filter) {
        this.filter = filter;
        return this;
    }
    setRelations(relations) {
        this.relations = relations;
        return this;
    }
    getRelations() {
        return this.relations;
    }
    getLimit() {
        return this.#limit * 1;
    }
    getSort() {
        return this.sort;
    }
    getFilter() {
        return this.filter;
    }
    getPage() {
        return this.#page !== undefined && this.#page > 0 ? this.#page : 1;
    }
    getStart() {
        return this.#start !== undefined ? this.#start : 0;
    }
    getSkip() {
        if (this.#start !== undefined) {
            return this.getStart();
        }
        return (this.getPage() - 1) * this.getLimit();
    }
    getTotalPages() {
        this.ensureCount();
        return Math.ceil(this.count / this.getLimit());
    }
    setCount(count) {
        this.count = count;
        return this;
    }
    ensureCount() {
        if (this.count === undefined) {
            throw new InternalServerError(ErrorCode.INVALID_PAYLOAD, ErrorDescription.INVALID_PAYLOAD, 'Please ensure to call setCount before using getTotalPages(), buildResult(');
        }
    }
    buildResult(result) {
        if (this.#start !== undefined) {
            return {
                meta: {
                    totalCount: this.count
                },
                items: result
            };
        }
        return {
            meta: {
                totalCount: this.count,
                currentPage: this.getPage(),
                totalPages: this.getTotalPages()
            },
            items: result
        };
    }
    hash(prefix = '') {
        return crypto
            .createHash('sha256')
            .update(JSON.stringify([prefix, this.getFilter(), this.getPage(), this.getSkip(), this.getRelations(), this.getLimit()]))
            .digest('hex');
    }
}
//# sourceMappingURL=pagination.dto.js.map