import { expect } from 'chai';
import {
  AccountHash,
  CLTypedAndToBytesHelper,
  CLValue,
  KeyValue,
  URef
} from '../../src';
import { TypedJSON } from 'typedjson';
import { BigNumber } from '@ethersproject/bignumber';

const clValueSerializer = new TypedJSON(CLValue);

const jsonRoundTrip = (value: CLValue, expectJSON: any) => {
  const toJSON = clValueSerializer.stringify(value);
  expect(toJSON).to.deep.equal(JSON.stringify(expectJSON));
  const clValue = clValueSerializer.parse(toJSON);
  expect(clValue?.toBytes()).to.deep.equal(value.toBytes());
};

describe('CLValue', () => {
  it('should be able to serialize/deserialize bool', () => {
    const b = CLValue.bool(true);
    jsonRoundTrip(b, { cl_type: 'Bool', bytes: '01' });
    expect(b.asBoolean()).to.deep.eq(true);

    const b2 = CLValue.bool(false);
    jsonRoundTrip(b2, { cl_type: 'Bool', bytes: '00' });
    expect(b2.asBoolean()).to.deep.eq(false);
  });

  it('should be able to serialize/deserialize u8', () => {
    const u8 = CLValue.u8(10);
    jsonRoundTrip(u8, { cl_type: 'U8', bytes: '0a' });
    expect(u8.asBigNumber()).to.deep.equal(BigNumber.from(10));
  });

  it('should be able to serialize/deserialize u32', () => {
    const u32 = CLValue.u32(0);
    jsonRoundTrip(u32, { cl_type: 'U32', bytes: '00000000' });
    expect(u32.asBigNumber().toNumber()).to.equal(0);

    const u32MaxValue = CLValue.u32(0xffffffff);
    jsonRoundTrip(u32MaxValue, { cl_type: 'U32', bytes: 'ffffffff' });
    expect(u32MaxValue.asBigNumber().toNumber()).to.equal(4294967295);
  });

  it('should be able to serialize/deserialize i32', () => {
    const i32MinValue = CLValue.i32(-2147483648);
    jsonRoundTrip(i32MinValue, { cl_type: 'I32', bytes: '00000080' });
    expect(i32MinValue.asBigNumber().toNumber()).to.equal(-2147483648);

    const i32MaxValue = CLValue.i32(2147483647);
    jsonRoundTrip(i32MaxValue, { cl_type: 'I32', bytes: 'ffffff7f' });
    expect(i32MaxValue.asBigNumber().toNumber()).to.equal(2147483647);
  });

  it('should be able to serialize/deserialize i64', () => {
    const i64Min = BigNumber.from('-9223372036854775808');
    const i64MinValue = CLValue.i64(i64Min);
    jsonRoundTrip(i64MinValue, { cl_type: 'I64', bytes: '0000000000000080' });
    expect(i64MinValue.asBigNumber()).to.deep.equal(i64Min);

    const i64Zero = 0;
    const i64ZeroValue = CLValue.i64(i64Zero);
    jsonRoundTrip(i64ZeroValue, { cl_type: 'I64', bytes: '0000000000000000' });
    expect(i64ZeroValue.asBigNumber().toNumber()).to.deep.equal(i64Zero);

    const i64Max = BigNumber.from('9223372036854775807');
    const i64MaxValue = CLValue.i64(i64Max);
    jsonRoundTrip(i64MaxValue, { cl_type: 'I64', bytes: 'ffffffffffffff7f' });
    expect(i64MaxValue.asBigNumber()).to.deep.equal(i64Max);
  });

  it('should be able to serialize/deserialize u64', () => {
    const u64ZeroValue = CLValue.u64(0);
    jsonRoundTrip(u64ZeroValue, { cl_type: 'U64', bytes: '0000000000000000' });
    expect(u64ZeroValue.asBigNumber().toNumber()).to.deep.eq(0);

    const u64MaxValue = CLValue.u64(BigNumber.from('18446744073709551615'));
    jsonRoundTrip(u64MaxValue, { cl_type: 'U64', bytes: 'ffffffffffffffff' });
    expect(u64MaxValue.asBigNumber()).to.deep.eq(
      BigNumber.from('18446744073709551615')
    );
  });

  it('should be able to serialize/deserialize u128', () => {
    const u128Zero = CLValue.u128(0);
    jsonRoundTrip(u128Zero, { cl_type: 'U128', bytes: '00' });
    expect(u128Zero.asBigNumber()).to.deep.equal(BigNumber.from(0));

    const u128_1 = CLValue.u128(1);
    jsonRoundTrip(u128_1, { cl_type: 'U128', bytes: '0101' });
    expect(u128_1.asBigNumber()).to.deep.equal(BigNumber.from(1));

    const u128_16 = CLValue.u128(16);
    jsonRoundTrip(u128_16, { cl_type: 'U128', bytes: '0110' });
    expect(u128_16.asBigNumber()).to.deep.equal(BigNumber.from(16));

    const u128_256 = CLValue.u128(256);
    jsonRoundTrip(u128_256, { cl_type: 'U128', bytes: '020001' });
    expect(u128_256.asBigNumber()).to.deep.equal(BigNumber.from(256));

    const u128MaxValue = CLValue.u128(
      BigNumber.from('340282366920938463463374607431768211455')
    );
    jsonRoundTrip(u128MaxValue, {
      cl_type: 'U128',
      bytes: '10ffffffffffffffffffffffffffffffff'
    });
    expect(u128MaxValue.asBigNumber()).to.deep.equal(
      BigNumber.from('340282366920938463463374607431768211455')
    );
  });

  it('should be able to serialize/deserialize u256', () => {
    const u256Zero = CLValue.u256(0);
    jsonRoundTrip(u256Zero, { cl_type: 'U256', bytes: '00' });
    expect(u256Zero.asBigNumber()).to.deep.equal(BigNumber.from(0));

    const u256_1 = CLValue.u256(1);
    jsonRoundTrip(u256_1, { cl_type: 'U256', bytes: '0101' });
    expect(u256_1.asBigNumber()).to.deep.equal(BigNumber.from(1));

    const u256_16 = CLValue.u256(16);
    jsonRoundTrip(u256_16, { cl_type: 'U256', bytes: '0110' });
    expect(u256_16.asBigNumber()).to.deep.equal(BigNumber.from(16));

    const u256_256 = CLValue.u256(256);
    jsonRoundTrip(u256_256, { cl_type: 'U256', bytes: '020001' });
    expect(u256_256.asBigNumber()).to.deep.equal(BigNumber.from(256));

    const u256MaxValue = CLValue.u256(
      BigNumber.from(
        '115792089237316195423570985008687907853269984665640564039457584007913129639935'
      )
    );
    jsonRoundTrip(u256MaxValue, {
      cl_type: 'U256',
      bytes:
        '20ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
    });
    expect(u256MaxValue.asBigNumber()).to.deep.equal(
      BigNumber.from(
        '115792089237316195423570985008687907853269984665640564039457584007913129639935'
      )
    );
  });

  it('should be able to serialize/deserialize unit', () => {
    const unit = CLValue.unit();
    jsonRoundTrip(unit, { cl_type: 'Unit', bytes: '' });
  });

  it('should be able to serialize/deserialize utf8 string', () => {
    const stringValue = CLValue.string('');
    jsonRoundTrip(stringValue, { cl_type: 'String', bytes: '00000000' });
    expect(stringValue.asString()).to.deep.eq('');
  });

  //
  // it('should serialize a vector of CLValue correctly', () => {
  //   const truth = decodeBase16(
  //     '0100000015000000110000006765745f7061796d656e745f70757273650a'
  //   );
  //   const bytes = toBytesVecT([CLValue.string('get_payment_purse')]);
  //   expect(bytes).to.deep.eq(truth);
  // });

  it('should serialize/deserialize variants of Key correctly', () => {
    const keyAccount = CLValue.key(
      KeyValue.fromAccount(new AccountHash(Uint8Array.from(Array(32).fill(1))))
    );
    jsonRoundTrip(keyAccount, {
      cl_type: 'Key',
      bytes:
        '000101010101010101010101010101010101010101010101010101010101010101'
    });

    const keyHash = CLValue.key(
      KeyValue.fromHash(Uint8Array.from(Array(32).fill(2)))
    );
    jsonRoundTrip(keyHash, {
      cl_type: 'Key',
      bytes:
        '010202020202020202020202020202020202020202020202020202020202020202'
    });

    const keyURef = CLValue.key(
      KeyValue.fromURef(
        URef.fromFormattedStr(
          'uref-0303030303030303030303030303030303030303030303030303030303030303-001'
        )
      )
    );
    jsonRoundTrip(keyURef, {
      cl_type: 'Key',
      bytes:
        '02030303030303030303030303030303030303030303030303030303030303030301'
    });
  });

  it('should serialize/deserialize URef correctly', () => {
    const uref = URef.fromFormattedStr(
      'uref-0606060606060606060606060606060606060606060606060606060606060606-007'
    );
    const urefValue = CLValue.uref(uref);
    jsonRoundTrip(urefValue, {
      cl_type: 'URef',
      bytes:
        '060606060606060606060606060606060606060606060606060606060606060607'
    });
  });

  it('should serialize/deserialize Tuple1 correctly', () => {
    const tuple1 = CLValue.tuple1(CLTypedAndToBytesHelper.bool(true));
    jsonRoundTrip(tuple1, { cl_type: { Tuple1: ['Bool'] }, bytes: '01' });

    const tuple2 = CLValue.tuple1(
      CLTypedAndToBytesHelper.tuple1(CLTypedAndToBytesHelper.bool(true))
    );
    jsonRoundTrip(tuple2, {
      cl_type: { Tuple1: [{ Tuple1: ['Bool'] }] },
      bytes: '01'
    });
  });

  it('should serialize/deserialize Tuple2 correctly', () => {
    const innerTuple1 = CLTypedAndToBytesHelper.tuple1(
      CLTypedAndToBytesHelper.bool(true)
    );
    const tuple2 = CLValue.tuple2(
      CLTypedAndToBytesHelper.u128(128),
      innerTuple1
    );
    jsonRoundTrip(tuple2, {
      cl_type: { Tuple2: ['U128', { Tuple1: ['Bool'] }] },
      bytes: '018001'
    });
  });

  it('should serialize/deserialize Tuple3 correctly', () => {
    const value1 = CLTypedAndToBytesHelper.string('hello');
    const value2 = CLTypedAndToBytesHelper.u64(123456);
    const value3 = CLTypedAndToBytesHelper.bool(true);
    const tuple3 = CLTypedAndToBytesHelper.tuple3(value1, value2, value3);
    jsonRoundTrip(CLValue.fromT(tuple3), {
      cl_type: { Tuple3: ['String', 'U64', 'Bool'] },
      bytes: '0500000068656c6c6f40e201000000000001'
    });

    const composedTuple3 = CLTypedAndToBytesHelper.tuple3(
      tuple3,
      tuple3,
      tuple3
    );

    jsonRoundTrip(CLValue.fromT(composedTuple3), {
      cl_type: {
        Tuple3: [
          { Tuple3: ['String', 'U64', 'Bool'] },
          { Tuple3: ['String', 'U64', 'Bool'] },
          { Tuple3: ['String', 'U64', 'Bool'] }
        ]
      },
      bytes:
        '0500000068656c6c6f40e2010000000000010500000068656c6c6f40e2010000000000010500000068656c6c6f40e201000000000001'
    });
  });

  // it('should serialize/deserialize List correctly', () => {
  //   const list = CLTypedAndToBytesHelper.list([
  //     CLTypedAndToBytesHelper.u32(1),
  //     CLTypedAndToBytesHelper.u32(2),
  //     CLTypedAndToBytesHelper.u32(3)
  //   ]);
  //   // prettier-ignore
  //   const expectedBytes = Uint8Array.from([3, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0]);
  //   expect(list.toBytes()).to.deep.eq(expectedBytes);
  //
  //   expect(
  //     List.fromBytes(
  //       CLTypeHelper.list(CLTypeHelper.u32()),
  //       expectedBytes
  //     ).value.toBytes()
  //   ).to.deep.eq(list.toBytes());
  // });
  //
  // it('should serialze/deserialize Map correctly', () => {
  //   const map = new MapValue([
  //     {
  //       key: CLTypedAndToBytesHelper.string('test1'),
  //       value: CLTypedAndToBytesHelper.list([
  //         CLTypedAndToBytesHelper.u64(1),
  //         CLTypedAndToBytesHelper.u64(2)
  //       ])
  //     },
  //     {
  //       key: CLTypedAndToBytesHelper.string('test2'),
  //       value: CLTypedAndToBytesHelper.list([
  //         CLTypedAndToBytesHelper.u64(3),
  //         CLTypedAndToBytesHelper.u64(4)
  //       ])
  //     }
  //   ]);
  //   // prettier-ignore
  //   const expectBytes = Uint8Array.from([2, 0, 0, 0, 5, 0, 0, 0, 116, 101, 115, 116, 49, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 116, 101, 115, 116, 50, 2, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0]);
  //
  //   expect(map.toBytes()).to.deep.eq(expectBytes);
  //
  //   expect(
  //     MapValue.fromBytes(
  //       CLTypeHelper.map(
  //         CLTypeHelper.string(),
  //         CLTypeHelper.list(CLTypeHelper.u64())
  //       ),
  //       expectBytes
  //     ).value.toBytes()
  //   ).to.deep.eq(expectBytes);
  // });
  //
  // it('should serialize/deserialize Option correctly', () => {
  //   const opt = CLTypedAndToBytesHelper.option(
  //     CLTypedAndToBytesHelper.string('test')
  //   );
  //   const expectBytes = Uint8Array.from([1, 4, 0, 0, 0, 116, 101, 115, 116]);
  //   expect(opt.toBytes()).to.deep.eq(expectBytes);
  //
  //   expect(
  //     Option.fromBytes(
  //       CLTypeHelper.option(CLTypeHelper.string()),
  //       expectBytes
  //     ).value.toBytes()
  //   ).to.deep.eq(expectBytes);
  // });
  //
  // it('should serialize ByteArray correctly', () => {
  //   const byteArray = Uint8Array.from(Array(32).fill(42));
  //   const bytes = CLValue.byteArray(byteArray).toBytes();
  //   expect(bytes).to.deep.eq(
  //     // prettier-ignore
  //     Uint8Array.from([
  //       32, 0, 0, 0, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42,
  //       42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 15,
  //       32, 0, 0, 0
  //     ])
  //   );
  // });
  //
  // it('should serialize PublicKey correctly', () => {
  //   const publicKey = Uint8Array.from(Array(32).fill(42));
  //   const bytes = PublicKey.fromEd25519(publicKey).toBytes();
  //   expect(bytes).to.deep.eq(
  //     // prettier-ignore
  //     Uint8Array.from([
  //       1, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42,
  //       42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42
  //     ])
  //   );
  // });
  //
  // it('should compute hex from PublicKey correctly', () => {
  //   const ed25519Account = Keys.Ed25519.new();
  //   const ed25519AccountHex = ed25519Account.accountHex();
  //   expect(PublicKey.fromHex(ed25519AccountHex)).to.deep.equal(
  //     ed25519Account.publicKey
  //   );
  //
  //   const secp256K1Account = Keys.Secp256K1.new();
  //   const secp256K1AccountHex = secp256K1Account.accountHex();
  //   expect(PublicKey.fromHex(secp256K1AccountHex)).to.deep.equal(
  //     secp256K1Account.publicKey
  //   );
  // });
});