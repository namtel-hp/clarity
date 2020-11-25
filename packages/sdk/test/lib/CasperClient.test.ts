import { expect } from 'chai';
import { CasperClient } from '../../src/lib/CasperClient';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Keys } from '../../src/lib';

let casperClient: CasperClient;
describe('CasperClient', () => {
  before(() => {
    casperClient = new CasperClient('http://mock1:6666', 'http://mock2:7777');
  });

  it('should generate new Ed25519 key pair, and compute public key from private key', () => {
    const edKeyPair = casperClient.newEdKeyPair();
    const publicKey = edKeyPair.publicKey.rawPublicKey;
    const privateKey = edKeyPair.privateKey;
    const convertFromPrivateKey = casperClient.privateToPublicKey(privateKey);
    expect(convertFromPrivateKey).to.deep.equal(publicKey);
  });

  it('should generate PEM file for Ed25519 correctly', () => {
    const edKeyPair = casperClient.newEdKeyPair();
    const publicKeyInPem = edKeyPair.exportPublicKeyInPem();
    const privateKeyInPem = edKeyPair.exportPrivateKeyInPem();

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-'));
    fs.writeFileSync(tempDir + '/public.pem', publicKeyInPem);
    fs.writeFileSync(tempDir + '/private.pem', privateKeyInPem);
    const publicKeyFromFIle = casperClient.loadEdPublicKeyFromFile(
      tempDir + '/public.pem'
    );
    const privateKeyFromFile = casperClient.loadEdPrivateKeyFromFile(
      tempDir + '/private.pem'
    );

    const keyPairFromFile = Keys.Ed25519.parseKeyPair(
      publicKeyFromFIle,
      privateKeyFromFile
    );

    expect(keyPairFromFile.publicKey.rawPublicKey).to.deep.equal(
      edKeyPair.publicKey.rawPublicKey
    );
    expect(keyPairFromFile.privateKey).to.deep.equal(edKeyPair.privateKey);
  });
});