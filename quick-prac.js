const myPromise = new Promise((resolve, reject) => {
    const isStudent = true;

    if (isStudent) {
        resolve('Resolved');
    } else {
        reject('Rejected');
    }
});

myPromise.then(resolved => {
    console.log(resolved);
}).catch(rejected => {
    console.log(rejected)
});