/*
 * Copyright © 2025 Kaleido, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity ^0.8.28;

import {CommonLib} from "./common.sol";

library GtLib {
    function generator() public pure returns (CommonLib.Fp12 memory) {
        return
            CommonLib.Fp12({
                c0: CommonLib.Fp6({
                    c0: CommonLib.Fp2({
                        c0: CommonLib.Fp({
                            a: 0x1250ebd871fc0a92a7b2d83168d0d727,
                            b: 0x272d441befa15c503dd8e90ce98db3e7b6d194f60839c508a84305aaca1789b6
                        }),
                        c1: CommonLib.Fp({
                            a: 0x089a1c5b46e5110b86750ec6a5323488,
                            b: 0x68a84045483c92b7af5af689452eafabf1a8943e50439f1d59882a98eaa0170f
                        })
                    }),
                    c1: CommonLib.Fp2({
                        c0: CommonLib.Fp({
                            a: 0x1368bb445c7c2d209703f239689ce34c,
                            b: 0x0378a68e72a6b3b216da0e22a5031b54ddff57309396b38c881c4c849ec23e87
                        }),
                        c1: CommonLib.Fp({
                            a: 0x193502b86edb8857c273fa075a505129,
                            b: 0x37e0794e1e65a7617c90d8bd66065b1fffe51d7a579973b1315021ec3c19934f
                        })
                    }),
                    c2: CommonLib.Fp2({
                        c0: CommonLib.Fp({
                            a: 0x01b2f522473d171391125ba84dc4007c,
                            b: 0xfbf2f8da752f7c74185203fcca589ac719c34dffbbaad8431dad1c1fb597aaa5
                        }),
                        c1: CommonLib.Fp({
                            a: 0x018107154f25a764bd3c79937a45b845,
                            b: 0x46da634b8f6be14a8061e55cceba478b23f7dacaa35c8ca78beae9624045b4b6
                        })
                    })
                }),
                c1: CommonLib.Fp6({
                    c0: CommonLib.Fp2({
                        c0: CommonLib.Fp({
                            a: 0x19f26337d205fb469cd6bd15c3d5a04d,
                            b: 0xc88784fbb3d0b2dbdea54d43b2b73f2cbb12d58386a8703e0f948226e47ee89d
                        }),
                        c1: CommonLib.Fp({
                            a: 0x06fba23eb7c5af0d9f80940ca771b6ff,
                            b: 0xd5857baaf222eb95a7d2809d61bfe02e1bfd1b68ff02f0b8102ae1c2d5d5ab1a
                        })
                    }),
                    c1: CommonLib.Fp2({
                        c0: CommonLib.Fp({
                            a: 0x11b8b424cd48bf38fcef68083b0b0ec5,
                            b: 0xc81a93b330ee1a677d0d15ff7b984e8978ef48881e32fac91b93b47333e2ba57
                        }),
                        c1: CommonLib.Fp({
                            a: 0x03350f55a7aefcd3c31b4fcb6ce5771c,
                            b: 0xc6a0e9786ab5973320c806ad360829107ba810c5a09ffdd9be2291a0c25a99a2
                        })
                    }),
                    c2: CommonLib.Fp2({
                        c0: CommonLib.Fp({
                            a: 0x04c581234d086a9902249b64728ffd21,
                            b: 0xa189e87935a954051c7cdba7b3872629a4fafc05066245cb9108f0242d0fe3ef
                        }),
                        c1: CommonLib.Fp({
                            a: 0x0f41e58663bf08cf068672cbd01a7ec7,
                            b: 0x3baca4d72ca93544deff686bfd6df543d48eaa24afe47e1efde449383b676631
                        })
                    })
                })
            });
    }
}
