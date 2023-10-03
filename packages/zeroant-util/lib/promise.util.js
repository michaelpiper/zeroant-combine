export class PromiseUtil {
    static wait = (promise) => {
        let isPending = true;
        let isRejected = false;
        let isFulfilled = false;
        let result;
        let error;
        const future = promise;
        future.then((v) => {
            isFulfilled = true;
            isPending = false;
            result = v;
            return v;
        }, (e) => {
            isRejected = true;
            isPending = false;
            error = e;
            return e;
        });
        future.isFulfilled = function () {
            return isFulfilled;
        };
        future.isPending = function () {
            return isPending;
        };
        future.isRejected = function () {
            return isRejected;
        };
        while (true) {
            if (isFulfilled) {
                return result;
            }
            if (isRejected && error !== undefined) {
                throw error;
            }
        }
    };
}
//# sourceMappingURL=promise.util.js.map