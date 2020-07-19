var chai = require('chai')
var chaihttp = require('chai-http')

chai.use(chaihttp)

var key

it('should ping our server', function (done) {
    chai.request('http://localhost:5000')
        .get('/')
        .end(function (err, res) {
            chai.expect(res).to.have.status(200);
            done();                               // <= Call done to signal callback end
        });
});

it('should generate an API key in memory', function (done) {

    chai.request('http://localhost:5000')
        .post('/key')
        .end(function (err, res) {
            chai.expect(res).to.have.status(200);
            done();                               // <= Call done to signal callback end
        });
});

it('should return an available API key randomly', function (done) {
    chai.request('http://localhost:5000')
        .get('/key')
        .end(function (err, res) {
            key = res.body.key
            console.log(key)
            chai.expect(res).to.have.status(200);
            done();                               // <= Call done to signal callback end
        });
});

it('should unblock the key', function (done) {
    var r = '/key/unblock?api='.concat(key)
    chai.request('http://localhost:5000')
        .post(r)
        .end(function (err, res) {
            chai.expect(res).to.have.status(200);
            done();                               // <= Call done to signal callback end
        });
});

it('should poll for extending API key expiry time', function (done) {
    var r = '/key/poll?api='.concat(key)
    console.log(r)
    chai.request('http://localhost:5000')
        .post(r)
        .end(function (err, res) {
            chai.expect(res).to.have.status(200);
            done();                               // <= Call done to signal callback end
        });
});

it('should delete the key', function (done) {
    var r = '/key?api='.concat(key)
    chai.request('http://localhost:5000')
        .delete(r)
        .end(function (err, res) {
            chai.expect(res).to.have.status(200);
            done();                               // <= Call done to signal callback end
        });
});