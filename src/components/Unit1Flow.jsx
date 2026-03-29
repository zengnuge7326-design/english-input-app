import { useState, useMemo, useEffect, useRef } from 'react'
import { quizBank } from '../data/quizData'
import { fillblankBank } from '../data/fillblankData'
import {
  listenWordBank,
  listenSentenceBank,
  listenOrderBank,
  listenResponseBank,
  listenTranslateBank,
} from '../data/listeningData'
import {
  quizBank2a,
  fillblankBank2a,
  listenWordBank2a,
  listenSentenceBank2a,
  listenOrderBank2a,
  listenResponseBank2a,
  listenTranslateBank2a,
} from '../data/unit2aData'
import {
  quizBank2b,
  fillblankBank2b,
  listenWordBank2b,
  listenSentenceBank2b,
  listenOrderBank2b,
  listenResponseBank2b,
  listenTranslateBank2b,
} from '../data/unit2bData'
import {
  quizBank2c,
  fillblankBank2c,
  listenWordBank2c,
  listenSentenceBank2c,
  listenOrderBank2c,
  listenResponseBank2c,
  listenTranslateBank2c,
} from '../data/unit2cData'
import {
  quizBank1b,
  fillblankBank1b,
  listenWordBank1b,
  listenSentenceBank1b,
  listenOrderBank1b,
  listenResponseBank1b,
  listenTranslateBank1b,
} from '../data/unit1bData'
import {
  quizBank1c,
  fillblankBank1c,
  listenWordBank1c,
  listenSentenceBank1c,
  listenOrderBank1c,
  listenResponseBank1c,
  listenTranslateBank1c,
} from '../data/unit1cData'
import {
  quizBank3a,
  fillblankBank3a,
  listenWordBank3a,
  listenSentenceBank3a,
  listenOrderBank3a,
  listenResponseBank3a,
  listenTranslateBank3a,
} from '../data/unit3aData'
import {
  quizBank3b,
  fillblankBank3b,
  listenWordBank3b,
  listenSentenceBank3b,
  listenOrderBank3b,
  listenResponseBank3b,
  listenTranslateBank3b,
} from '../data/unit3bData'
import {
  quizBank3c,
  fillblankBank3c,
  listenWordBank3c,
  listenSentenceBank3c,
  listenOrderBank3c,
  listenResponseBank3c,
  listenTranslateBank3c,
} from '../data/unit3cData'
import {
  quizBank4a,
  fillblankBank4a,
  listenWordBank4a,
  listenSentenceBank4a,
  listenOrderBank4a,
  listenResponseBank4a,
  listenTranslateBank4a,
} from '../data/unit4aData'
import {
  quizBank4b,
  fillblankBank4b,
  listenWordBank4b,
  listenSentenceBank4b,
  listenOrderBank4b,
  listenResponseBank4b,
  listenTranslateBank4b,
} from '../data/unit4bData'
import {
  quizBank4c,
  fillblankBank4c,
  listenWordBank4c,
  listenSentenceBank4c,
  listenOrderBank4c,
  listenResponseBank4c,
  listenTranslateBank4c,
} from '../data/unit4cData'
import {
  quizBank5a,
  fillblankBank5a,
  listenWordBank5a,
  listenSentenceBank5a,
  listenOrderBank5a,
  listenResponseBank5a,
  listenTranslateBank5a,
} from '../data/unit5aData'
import {
  quizBank5b,
  fillblankBank5b,
  listenWordBank5b,
  listenSentenceBank5b,
  listenOrderBank5b,
  listenResponseBank5b,
  listenTranslateBank5b,
} from '../data/unit5bData'
import {
  quizBank6a,
  fillblankBank6a,
  listenWordBank6a,
  listenSentenceBank6a,
  listenOrderBank6a,
  listenResponseBank6a,
  listenTranslateBank6a,
} from '../data/unit6aData'
import {
  quizBank6b,
  fillblankBank6b,
  listenWordBank6b,
  listenSentenceBank6b,
  listenOrderBank6b,
  listenResponseBank6b,
  listenTranslateBank6b,
} from '../data/unit6bData'
import {
  quizBank6c,
  fillblankBank6c,
  listenWordBank6c,
  listenSentenceBank6c,
  listenOrderBank6c,
  listenResponseBank6c,
  listenTranslateBank6c,
} from '../data/unit6cData'
import {
  quizBankG4U1a,
  fillblankBankG4U1a,
  listenWordBankG4U1a,
  listenSentenceBankG4U1a,
  listenOrderBankG4U1a,
  listenResponseBankG4U1a,
  listenTranslateBankG4U1a,
} from '../data/g4u_unit1aData'
import {
  quizBankG4U1b,
  fillblankBankG4U1b,
  listenWordBankG4U1b,
  listenSentenceBankG4U1b,
  listenOrderBankG4U1b,
  listenResponseBankG4U1b,
  listenTranslateBankG4U1b,
} from '../data/g4u_unit1bData'
import {
  quizBankG4U1c,
  fillblankBankG4U1c,
  listenWordBankG4U1c,
  listenSentenceBankG4U1c,
  listenOrderBankG4U1c,
  listenResponseBankG4U1c,
  listenTranslateBankG4U1c,
} from '../data/g4u_unit1cData'
import {
  quizBankG4U2a,
  fillblankBankG4U2a,
  listenWordBankG4U2a,
  listenSentenceBankG4U2a,
  listenOrderBankG4U2a,
  listenResponseBankG4U2a,
  listenTranslateBankG4U2a,
} from '../data/g4u_unit2aData'
import {
  quizBankG4U2b,
  fillblankBankG4U2b,
  listenWordBankG4U2b,
  listenSentenceBankG4U2b,
  listenOrderBankG4U2b,
  listenResponseBankG4U2b,
  listenTranslateBankG4U2b,
} from '../data/g4u_unit2bData'
import {
  quizBankG4U2c,
  fillblankBankG4U2c,
  listenWordBankG4U2c,
  listenSentenceBankG4U2c,
  listenOrderBankG4U2c,
  listenResponseBankG4U2c,
  listenTranslateBankG4U2c,
} from '../data/g4u_unit2cData'
import {
  quizBankG4U3a,
  fillblankBankG4U3a,
  listenWordBankG4U3a,
  listenSentenceBankG4U3a,
  listenOrderBankG4U3a,
  listenResponseBankG4U3a,
  listenTranslateBankG4U3a,
} from '../data/g4u_unit3aData'
import {
  quizBankG4U3b,
  fillblankBankG4U3b,
  listenWordBankG4U3b,
  listenSentenceBankG4U3b,
  listenOrderBankG4U3b,
  listenResponseBankG4U3b,
  listenTranslateBankG4U3b,
} from '../data/g4u_unit3bData'
import {
  quizBankG4U3c,
  fillblankBankG4U3c,
  listenWordBankG4U3c,
  listenSentenceBankG4U3c,
  listenOrderBankG4U3c,
  listenResponseBankG4U3c,
  listenTranslateBankG4U3c,
} from '../data/g4u_unit3cData'
import {
  quizBankG4U4a,
  fillblankBankG4U4a,
  listenWordBankG4U4a,
  listenSentenceBankG4U4a,
  listenOrderBankG4U4a,
  listenResponseBankG4U4a,
  listenTranslateBankG4U4a,
} from '../data/g4u_unit4aData'
import {
  quizBankG4U4b,
  fillblankBankG4U4b,
  listenWordBankG4U4b,
  listenSentenceBankG4U4b,
  listenOrderBankG4U4b,
  listenResponseBankG4U4b,
  listenTranslateBankG4U4b,
} from '../data/g4u_unit4bData'
import {
  quizBankG4U4c,
  fillblankBankG4U4c,
  listenWordBankG4U4c,
  listenSentenceBankG4U4c,
  listenOrderBankG4U4c,
  listenResponseBankG4U4c,
  listenTranslateBankG4U4c,
} from '../data/g4u_unit4cData'
import {
  quizBankG4U5a,
  fillblankBankG4U5a,
  listenWordBankG4U5a,
  listenSentenceBankG4U5a,
  listenOrderBankG4U5a,
  listenResponseBankG4U5a,
  listenTranslateBankG4U5a,
} from '../data/g4u_unit5aData'
import {
  quizBankG4U5b,
  fillblankBankG4U5b,
  listenWordBankG4U5b,
  listenSentenceBankG4U5b,
  listenOrderBankG4U5b,
  listenResponseBankG4U5b,
  listenTranslateBankG4U5b,
} from '../data/g4u_unit5bData'
import {
  quizBankG4U5c,
  fillblankBankG4U5c,
  listenWordBankG4U5c,
  listenSentenceBankG4U5c,
  listenOrderBankG4U5c,
  listenResponseBankG4U5c,
  listenTranslateBankG4U5c,
} from '../data/g4u_unit5cData'
import {
  quizBankG4U6a,
  fillblankBankG4U6a,
  listenWordBankG4U6a,
  listenSentenceBankG4U6a,
  listenOrderBankG4U6a,
  listenResponseBankG4U6a,
  listenTranslateBankG4U6a,
} from '../data/g4u_unit6aData'
import {
  quizBankG4U6b,
  fillblankBankG4U6b,
  listenWordBankG4U6b,
  listenSentenceBankG4U6b,
  listenOrderBankG4U6b,
  listenResponseBankG4U6b,
  listenTranslateBankG4U6b,
} from '../data/g4u_unit6bData'
import {
  quizBankG4U6c,
  fillblankBankG4U6c,
  listenWordBankG4U6c,
  listenSentenceBankG4U6c,
  listenOrderBankG4U6c,
  listenResponseBankG4U6c,
  listenTranslateBankG4U6c,
} from '../data/g4u_unit6cData'
import {
  quizBankG3U1a,
  fillblankBankG3U1a,
  listenWordBankG3U1a,
  listenSentenceBankG3U1a,
  listenOrderBankG3U1a,
  listenResponseBankG3U1a,
  listenTranslateBankG3U1a,
} from '../data/g3u_unit1aData'
import {
  quizBankG3U1b,
  fillblankBankG3U1b,
  listenWordBankG3U1b,
  listenSentenceBankG3U1b,
  listenOrderBankG3U1b,
  listenResponseBankG3U1b,
  listenTranslateBankG3U1b,
} from '../data/g3u_unit1bData'
import {
  quizBankG3U1c,
  fillblankBankG3U1c,
  listenWordBankG3U1c,
  listenSentenceBankG3U1c,
  listenOrderBankG3U1c,
  listenResponseBankG3U1c,
  listenTranslateBankG3U1c,
} from '../data/g3u_unit1cData'
import {
  quizBankG3U2a,
  fillblankBankG3U2a,
  listenWordBankG3U2a,
  listenSentenceBankG3U2a,
  listenOrderBankG3U2a,
  listenResponseBankG3U2a,
  listenTranslateBankG3U2a,
} from '../data/g3u_unit2aData'
import {
  quizBankG3U2b,
  fillblankBankG3U2b,
  listenWordBankG3U2b,
  listenSentenceBankG3U2b,
  listenOrderBankG3U2b,
  listenResponseBankG3U2b,
  listenTranslateBankG3U2b,
} from '../data/g3u_unit2bData'
import {
  quizBankG3U2c,
  fillblankBankG3U2c,
  listenWordBankG3U2c,
  listenSentenceBankG3U2c,
  listenOrderBankG3U2c,
  listenResponseBankG3U2c,
  listenTranslateBankG3U2c,
} from '../data/g3u_unit2cData'
import {
  quizBankG3U3a,
  fillblankBankG3U3a,
  listenWordBankG3U3a,
  listenSentenceBankG3U3a,
  listenOrderBankG3U3a,
  listenResponseBankG3U3a,
  listenTranslateBankG3U3a,
} from '../data/g3u_unit3aData'
import {
  quizBankG3U3b,
  fillblankBankG3U3b,
  listenWordBankG3U3b,
  listenSentenceBankG3U3b,
  listenOrderBankG3U3b,
  listenResponseBankG3U3b,
  listenTranslateBankG3U3b,
} from '../data/g3u_unit3bData'
import {
  quizBankG3U3c,
  fillblankBankG3U3c,
  listenWordBankG3U3c,
  listenSentenceBankG3U3c,
  listenOrderBankG3U3c,
  listenResponseBankG3U3c,
  listenTranslateBankG3U3c,
} from '../data/g3u_unit3cData'
import {
  quizBankG3U4a,
  fillblankBankG3U4a,
  listenWordBankG3U4a,
  listenSentenceBankG3U4a,
  listenOrderBankG3U4a,
  listenResponseBankG3U4a,
  listenTranslateBankG3U4a,
} from '../data/g3u_unit4aData'
import {
  quizBankG3U4b,
  fillblankBankG3U4b,
  listenWordBankG3U4b,
  listenSentenceBankG3U4b,
  listenOrderBankG3U4b,
  listenResponseBankG3U4b,
  listenTranslateBankG3U4b,
} from '../data/g3u_unit4bData'
import {
  quizBankG3U4c,
  fillblankBankG3U4c,
  listenWordBankG3U4c,
  listenSentenceBankG3U4c,
  listenOrderBankG3U4c,
  listenResponseBankG3U4c,
  listenTranslateBankG3U4c,
} from '../data/g3u_unit4cData'
import {
  quizBankG3U5a,
  fillblankBankG3U5a,
  listenWordBankG3U5a,
  listenSentenceBankG3U5a,
  listenOrderBankG3U5a,
  listenResponseBankG3U5a,
  listenTranslateBankG3U5a,
} from '../data/g3u_unit5aData'
import {
  quizBankG3U5b,
  fillblankBankG3U5b,
  listenWordBankG3U5b,
  listenSentenceBankG3U5b,
  listenOrderBankG3U5b,
  listenResponseBankG3U5b,
  listenTranslateBankG3U5b,
} from '../data/g3u_unit5bData'
import {
  quizBankG3U5c,
  fillblankBankG3U5c,
  listenWordBankG3U5c,
  listenSentenceBankG3U5c,
  listenOrderBankG3U5c,
  listenResponseBankG3U5c,
  listenTranslateBankG3U5c,
} from '../data/g3u_unit5cData'
import {
  quizBankG3U6a,
  fillblankBankG3U6a,
  listenWordBankG3U6a,
  listenSentenceBankG3U6a,
  listenOrderBankG3U6a,
  listenResponseBankG3U6a,
  listenTranslateBankG3U6a,
} from '../data/g3u_unit6aData'
import {
  quizBankG3U6b,
  fillblankBankG3U6b,
  listenWordBankG3U6b,
  listenSentenceBankG3U6b,
  listenOrderBankG3U6b,
  listenResponseBankG3U6b,
  listenTranslateBankG3U6b,
} from '../data/g3u_unit6bData'
import {
  quizBankG3U6c,
  fillblankBankG3U6c,
  listenWordBankG3U6c,
  listenSentenceBankG3U6c,
  listenOrderBankG3U6c,
  listenResponseBankG3U6c,
  listenTranslateBankG3U6c,
} from '../data/g3u_unit6cData'
import {
  quizBankG3D1a,
  fillblankBankG3D1a,
  listenWordBankG3D1a,
  listenSentenceBankG3D1a,
  listenOrderBankG3D1a,
  listenResponseBankG3D1a,
  listenTranslateBankG3D1a,
} from '../data/g3d_unit1aData'
import {
  quizBankG3D1b,
  fillblankBankG3D1b,
  listenWordBankG3D1b,
  listenSentenceBankG3D1b,
  listenOrderBankG3D1b,
  listenResponseBankG3D1b,
  listenTranslateBankG3D1b,
} from '../data/g3d_unit1bData'
import {
  quizBankG3D1c,
  fillblankBankG3D1c,
  listenWordBankG3D1c,
  listenSentenceBankG3D1c,
  listenOrderBankG3D1c,
  listenResponseBankG3D1c,
  listenTranslateBankG3D1c,
} from '../data/g3d_unit1cData'
import {
  quizBankG3D2a,
  fillblankBankG3D2a,
  listenWordBankG3D2a,
  listenSentenceBankG3D2a,
  listenOrderBankG3D2a,
  listenResponseBankG3D2a,
  listenTranslateBankG3D2a,
} from '../data/g3d_unit2aData'
import {
  quizBankG3D2b,
  fillblankBankG3D2b,
  listenWordBankG3D2b,
  listenSentenceBankG3D2b,
  listenOrderBankG3D2b,
  listenResponseBankG3D2b,
  listenTranslateBankG3D2b,
} from '../data/g3d_unit2bData'
import {
  quizBankG3D2c,
  fillblankBankG3D2c,
  listenWordBankG3D2c,
  listenSentenceBankG3D2c,
  listenOrderBankG3D2c,
  listenResponseBankG3D2c,
  listenTranslateBankG3D2c,
} from '../data/g3d_unit2cData'
import {
  quizBankG3D3a,
  fillblankBankG3D3a,
  listenWordBankG3D3a,
  listenSentenceBankG3D3a,
  listenOrderBankG3D3a,
  listenResponseBankG3D3a,
  listenTranslateBankG3D3a,
} from '../data/g3d_unit3aData'
import {
  quizBankG3D3b,
  fillblankBankG3D3b,
  listenWordBankG3D3b,
  listenSentenceBankG3D3b,
  listenOrderBankG3D3b,
  listenResponseBankG3D3b,
  listenTranslateBankG3D3b,
} from '../data/g3d_unit3bData'
import {
  quizBankG3D3c,
  fillblankBankG3D3c,
  listenWordBankG3D3c,
  listenSentenceBankG3D3c,
  listenOrderBankG3D3c,
  listenResponseBankG3D3c,
  listenTranslateBankG3D3c,
} from '../data/g3d_unit3cData'
import {
  quizBankG3D4a,
  fillblankBankG3D4a,
  listenWordBankG3D4a,
  listenSentenceBankG3D4a,
  listenOrderBankG3D4a,
  listenResponseBankG3D4a,
  listenTranslateBankG3D4a,
} from '../data/g3d_unit4aData'
import {
  quizBankG3D4b,
  fillblankBankG3D4b,
  listenWordBankG3D4b,
  listenSentenceBankG3D4b,
  listenOrderBankG3D4b,
  listenResponseBankG3D4b,
  listenTranslateBankG3D4b,
} from '../data/g3d_unit4bData'
import {
  quizBankG3D4c,
  fillblankBankG3D4c,
  listenWordBankG3D4c,
  listenSentenceBankG3D4c,
  listenOrderBankG3D4c,
  listenResponseBankG3D4c,
  listenTranslateBankG3D4c,
} from '../data/g3d_unit4cData'
import {
  quizBankG3D5a,
  fillblankBankG3D5a,
  listenWordBankG3D5a,
  listenSentenceBankG3D5a,
  listenOrderBankG3D5a,
  listenResponseBankG3D5a,
  listenTranslateBankG3D5a,
} from '../data/g3d_unit5aData'
import {
  quizBankG3D5b,
  fillblankBankG3D5b,
  listenWordBankG3D5b,
  listenSentenceBankG3D5b,
  listenOrderBankG3D5b,
  listenResponseBankG3D5b,
  listenTranslateBankG3D5b,
} from '../data/g3d_unit5bData'
import {
  quizBankG3D5c,
  fillblankBankG3D5c,
  listenWordBankG3D5c,
  listenSentenceBankG3D5c,
  listenOrderBankG3D5c,
  listenResponseBankG3D5c,
  listenTranslateBankG3D5c,
} from '../data/g3d_unit5cData'
import {
  quizBankG3D6a,
  fillblankBankG3D6a,
  listenWordBankG3D6a,
  listenSentenceBankG3D6a,
  listenOrderBankG3D6a,
  listenResponseBankG3D6a,
  listenTranslateBankG3D6a,
} from '../data/g3d_unit6aData'
import {
  quizBankG3D6b,
  fillblankBankG3D6b,
  listenWordBankG3D6b,
  listenSentenceBankG3D6b,
  listenOrderBankG3D6b,
  listenResponseBankG3D6b,
  listenTranslateBankG3D6b,
} from '../data/g3d_unit6bData'
import {
  quizBankG3D6c,
  fillblankBankG3D6c,
  listenWordBankG3D6c,
  listenSentenceBankG3D6c,
  listenOrderBankG3D6c,
  listenResponseBankG3D6c,
  listenTranslateBankG3D6c,
} from '../data/g3d_unit6cData'
import {
  quizBankG5U1a, fillblankBankG5U1a, listenWordBankG5U1a, listenSentenceBankG5U1a, listenOrderBankG5U1a, listenResponseBankG5U1a, listenTranslateBankG5U1a,
} from '../data/g5u_unit1aData'
import {
  quizBankG5U1b, fillblankBankG5U1b, listenWordBankG5U1b, listenSentenceBankG5U1b, listenOrderBankG5U1b, listenResponseBankG5U1b, listenTranslateBankG5U1b,
} from '../data/g5u_unit1bData'
import {
  quizBankG5U1c, fillblankBankG5U1c, listenWordBankG5U1c, listenSentenceBankG5U1c, listenOrderBankG5U1c, listenResponseBankG5U1c, listenTranslateBankG5U1c,
} from '../data/g5u_unit1cData'
import {
  quizBankG5U2a, fillblankBankG5U2a, listenWordBankG5U2a, listenSentenceBankG5U2a, listenOrderBankG5U2a, listenResponseBankG5U2a, listenTranslateBankG5U2a,
} from '../data/g5u_unit2aData'
import {
  quizBankG5U2b, fillblankBankG5U2b, listenWordBankG5U2b, listenSentenceBankG5U2b, listenOrderBankG5U2b, listenResponseBankG5U2b, listenTranslateBankG5U2b,
} from '../data/g5u_unit2bData'
import {
  quizBankG5U2c, fillblankBankG5U2c, listenWordBankG5U2c, listenSentenceBankG5U2c, listenOrderBankG5U2c, listenResponseBankG5U2c, listenTranslateBankG5U2c,
} from '../data/g5u_unit2cData'
import {
  quizBankG5U3a, fillblankBankG5U3a, listenWordBankG5U3a, listenSentenceBankG5U3a, listenOrderBankG5U3a, listenResponseBankG5U3a, listenTranslateBankG5U3a,
} from '../data/g5u_unit3aData'
import {
  quizBankG5U3b, fillblankBankG5U3b, listenWordBankG5U3b, listenSentenceBankG5U3b, listenOrderBankG5U3b, listenResponseBankG5U3b, listenTranslateBankG5U3b,
} from '../data/g5u_unit3bData'
import {
  quizBankG5U3c, fillblankBankG5U3c, listenWordBankG5U3c, listenSentenceBankG5U3c, listenOrderBankG5U3c, listenResponseBankG5U3c, listenTranslateBankG5U3c,
} from '../data/g5u_unit3cData'
import {
  quizBankG5U4a, fillblankBankG5U4a, listenWordBankG5U4a, listenSentenceBankG5U4a, listenOrderBankG5U4a, listenResponseBankG5U4a, listenTranslateBankG5U4a,
} from '../data/g5u_unit4aData'
import {
  quizBankG5U4b, fillblankBankG5U4b, listenWordBankG5U4b, listenSentenceBankG5U4b, listenOrderBankG5U4b, listenResponseBankG5U4b, listenTranslateBankG5U4b,
} from '../data/g5u_unit4bData'
import {
  quizBankG5U4c, fillblankBankG5U4c, listenWordBankG5U4c, listenSentenceBankG5U4c, listenOrderBankG5U4c, listenResponseBankG5U4c, listenTranslateBankG5U4c,
} from '../data/g5u_unit4cData'
import {
  quizBankG5U5a, fillblankBankG5U5a, listenWordBankG5U5a, listenSentenceBankG5U5a, listenOrderBankG5U5a, listenResponseBankG5U5a, listenTranslateBankG5U5a,
} from '../data/g5u_unit5aData'
import {
  quizBankG5U5b, fillblankBankG5U5b, listenWordBankG5U5b, listenSentenceBankG5U5b, listenOrderBankG5U5b, listenResponseBankG5U5b, listenTranslateBankG5U5b,
} from '../data/g5u_unit5bData'
import {
  quizBankG5U5c, fillblankBankG5U5c, listenWordBankG5U5c, listenSentenceBankG5U5c, listenOrderBankG5U5c, listenResponseBankG5U5c, listenTranslateBankG5U5c,
} from '../data/g5u_unit5cData'
import {
  quizBankG5U6a, fillblankBankG5U6a, listenWordBankG5U6a, listenSentenceBankG5U6a, listenOrderBankG5U6a, listenResponseBankG5U6a, listenTranslateBankG5U6a,
} from '../data/g5u_unit6aData'
import {
  quizBankG5U6b, fillblankBankG5U6b, listenWordBankG5U6b, listenSentenceBankG5U6b, listenOrderBankG5U6b, listenResponseBankG5U6b, listenTranslateBankG5U6b,
} from '../data/g5u_unit6bData'
import {
  quizBankG5U6c, fillblankBankG5U6c, listenWordBankG5U6c, listenSentenceBankG5U6c, listenOrderBankG5U6c, listenResponseBankG5U6c, listenTranslateBankG5U6c,
} from '../data/g5u_unit6cData'
import {
  quizBankG5D1a, fillblankBankG5D1a, listenWordBankG5D1a, listenSentenceBankG5D1a, listenOrderBankG5D1a, listenResponseBankG5D1a, listenTranslateBankG5D1a,
} from '../data/g5d_unit1aData'
import {
  quizBankG5D1b, fillblankBankG5D1b, listenWordBankG5D1b, listenSentenceBankG5D1b, listenOrderBankG5D1b, listenResponseBankG5D1b, listenTranslateBankG5D1b,
} from '../data/g5d_unit1bData'
import {
  quizBankG5D1c, fillblankBankG5D1c, listenWordBankG5D1c, listenSentenceBankG5D1c, listenOrderBankG5D1c, listenResponseBankG5D1c, listenTranslateBankG5D1c,
} from '../data/g5d_unit1cData'
import {
  quizBankG5D2a, fillblankBankG5D2a, listenWordBankG5D2a, listenSentenceBankG5D2a, listenOrderBankG5D2a, listenResponseBankG5D2a, listenTranslateBankG5D2a,
} from '../data/g5d_unit2aData'
import {
  quizBankG5D2b, fillblankBankG5D2b, listenWordBankG5D2b, listenSentenceBankG5D2b, listenOrderBankG5D2b, listenResponseBankG5D2b, listenTranslateBankG5D2b,
} from '../data/g5d_unit2bData'
import {
  quizBankG5D2c, fillblankBankG5D2c, listenWordBankG5D2c, listenSentenceBankG5D2c, listenOrderBankG5D2c, listenResponseBankG5D2c, listenTranslateBankG5D2c,
} from '../data/g5d_unit2cData'
import {
  quizBankG5D3a, fillblankBankG5D3a, listenWordBankG5D3a, listenSentenceBankG5D3a, listenOrderBankG5D3a, listenResponseBankG5D3a, listenTranslateBankG5D3a,
} from '../data/g5d_unit3aData'
import {
  quizBankG5D3b, fillblankBankG5D3b, listenWordBankG5D3b, listenSentenceBankG5D3b, listenOrderBankG5D3b, listenResponseBankG5D3b, listenTranslateBankG5D3b,
} from '../data/g5d_unit3bData'
import {
  quizBankG5D3c, fillblankBankG5D3c, listenWordBankG5D3c, listenSentenceBankG5D3c, listenOrderBankG5D3c, listenResponseBankG5D3c, listenTranslateBankG5D3c,
} from '../data/g5d_unit3cData'
import {
  quizBankG5D4a, fillblankBankG5D4a, listenWordBankG5D4a, listenSentenceBankG5D4a, listenOrderBankG5D4a, listenResponseBankG5D4a, listenTranslateBankG5D4a,
} from '../data/g5d_unit4aData'
import {
  quizBankG5D4b, fillblankBankG5D4b, listenWordBankG5D4b, listenSentenceBankG5D4b, listenOrderBankG5D4b, listenResponseBankG5D4b, listenTranslateBankG5D4b,
} from '../data/g5d_unit4bData'
import {
  quizBankG5D4c, fillblankBankG5D4c, listenWordBankG5D4c, listenSentenceBankG5D4c, listenOrderBankG5D4c, listenResponseBankG5D4c, listenTranslateBankG5D4c,
} from '../data/g5d_unit4cData'
import {
  quizBankG5D5a, fillblankBankG5D5a, listenWordBankG5D5a, listenSentenceBankG5D5a, listenOrderBankG5D5a, listenResponseBankG5D5a, listenTranslateBankG5D5a,
} from '../data/g5d_unit5aData'
import {
  quizBankG5D5b, fillblankBankG5D5b, listenWordBankG5D5b, listenSentenceBankG5D5b, listenOrderBankG5D5b, listenResponseBankG5D5b, listenTranslateBankG5D5b,
} from '../data/g5d_unit5bData'
import {
  quizBankG5D5c, fillblankBankG5D5c, listenWordBankG5D5c, listenSentenceBankG5D5c, listenOrderBankG5D5c, listenResponseBankG5D5c, listenTranslateBankG5D5c,
} from '../data/g5d_unit5cData'
import {
  quizBankG5D6a, fillblankBankG5D6a, listenWordBankG5D6a, listenSentenceBankG5D6a, listenOrderBankG5D6a, listenResponseBankG5D6a, listenTranslateBankG5D6a,
} from '../data/g5d_unit6aData'
import {
  quizBankG5D6b, fillblankBankG5D6b, listenWordBankG5D6b, listenSentenceBankG5D6b, listenOrderBankG5D6b, listenResponseBankG5D6b, listenTranslateBankG5D6b,
} from '../data/g5d_unit6bData'
import {
  quizBankG5D6c, fillblankBankG5D6c, listenWordBankG5D6c, listenSentenceBankG5D6c, listenOrderBankG5D6c, listenResponseBankG5D6c, listenTranslateBankG5D6c,
} from '../data/g5d_unit6cData'

// ── 工具：生成随机字母供填词干扰 ────────────────────────────────────────────────
function speak(text) {
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = 0.85
  speechSynthesis.cancel()
  speechSynthesis.speak(u)
}

// 把所有题型数据统一标记 type
function buildQuestions(banks) {
  if (!banks) return [];
  const { quiz, fillblank, word, sentence, order, response, translate } = banks;
  const questions = [];
  if (quiz) quiz.forEach(q => questions.push({ type: 'quiz', data: q }));
  if (fillblank) fillblank.forEach(q => questions.push({ type: 'fillblank', data: q }));
  if (word) word.forEach(q => questions.push({ type: 'listen_word', data: q }));
  if (sentence) sentence.forEach(q => questions.push({ type: 'listen_sentence', data: q }));
  if (order) order.forEach(q => questions.push({ type: 'listen_order', data: q }));
  if (response) response.forEach(q => questions.push({ type: 'listen_response', data: q }));
  if (translate) translate.forEach(q => questions.push({ type: 'listen_translate', data: q }));
  return questions
}

const BANKS_G3_UP = {
  unit1a: {
    quiz: quizBankG3U1a, fillblank: fillblankBankG3U1a,
    word: listenWordBankG3U1a, sentence: listenSentenceBankG3U1a,
    order: listenOrderBankG3U1a, response: listenResponseBankG3U1a,
    translate: listenTranslateBankG3U1a,
  },
  unit1b: {
    quiz: quizBankG3U1b, fillblank: fillblankBankG3U1b,
    word: listenWordBankG3U1b, sentence: listenSentenceBankG3U1b,
    order: listenOrderBankG3U1b, response: listenResponseBankG3U1b,
    translate: listenTranslateBankG3U1b,
  },
  unit1c: {
    quiz: quizBankG3U1c, fillblank: fillblankBankG3U1c,
    word: listenWordBankG3U1c, sentence: listenSentenceBankG3U1c,
    order: listenOrderBankG3U1c, response: listenResponseBankG3U1c,
    translate: listenTranslateBankG3U1c,
  },
  unit2a: {
    quiz: quizBankG3U2a, fillblank: fillblankBankG3U2a,
    word: listenWordBankG3U2a, sentence: listenSentenceBankG3U2a,
    order: listenOrderBankG3U2a, response: listenResponseBankG3U2a,
    translate: listenTranslateBankG3U2a,
  },
  unit2b: {
    quiz: quizBankG3U2b, fillblank: fillblankBankG3U2b,
    word: listenWordBankG3U2b, sentence: listenSentenceBankG3U2b,
    order: listenOrderBankG3U2b, response: listenResponseBankG3U2b,
    translate: listenTranslateBankG3U2b,
  },
  unit2c: {
    quiz: quizBankG3U2c, fillblank: fillblankBankG3U2c,
    word: listenWordBankG3U2c, sentence: listenSentenceBankG3U2c,
    order: listenOrderBankG3U2c, response: listenResponseBankG3U2c,
    translate: listenTranslateBankG3U2c,
  },
  unit3a: {
    quiz: quizBankG3U3a, fillblank: fillblankBankG3U3a,
    word: listenWordBankG3U3a, sentence: listenSentenceBankG3U3a,
    order: listenOrderBankG3U3a, response: listenResponseBankG3U3a,
    translate: listenTranslateBankG3U3a,
  },
  unit3b: {
    quiz: quizBankG3U3b, fillblank: fillblankBankG3U3b,
    word: listenWordBankG3U3b, sentence: listenSentenceBankG3U3b,
    order: listenOrderBankG3U3b, response: listenResponseBankG3U3b,
    translate: listenTranslateBankG3U3b,
  },
  unit3c: {
    quiz: quizBankG3U3c, fillblank: fillblankBankG3U3c,
    word: listenWordBankG3U3c, sentence: listenSentenceBankG3U3c,
    order: listenOrderBankG3U3c, response: listenResponseBankG3U3c,
    translate: listenTranslateBankG3U3c,
  },
  unit4a: {
    quiz: quizBankG3U4a, fillblank: fillblankBankG3U4a,
    word: listenWordBankG3U4a, sentence: listenSentenceBankG3U4a,
    order: listenOrderBankG3U4a, response: listenResponseBankG3U4a,
    translate: listenTranslateBankG3U4a,
  },
  unit4b: {
    quiz: quizBankG3U4b, fillblank: fillblankBankG3U4b,
    word: listenWordBankG3U4b, sentence: listenSentenceBankG3U4b,
    order: listenOrderBankG3U4b, response: listenResponseBankG3U4b,
    translate: listenTranslateBankG3U4b,
  },
  unit4c: {
    quiz: quizBankG3U4c, fillblank: fillblankBankG3U4c,
    word: listenWordBankG3U4c, sentence: listenSentenceBankG3U4c,
    order: listenOrderBankG3U4c, response: listenResponseBankG3U4c,
    translate: listenTranslateBankG3U4c,
  },
  unit5a: {
    quiz: quizBankG3U5a, fillblank: fillblankBankG3U5a,
    word: listenWordBankG3U5a, sentence: listenSentenceBankG3U5a,
    order: listenOrderBankG3U5a, response: listenResponseBankG3U5a,
    translate: listenTranslateBankG3U5a,
  },
  unit5b: {
    quiz: quizBankG3U5b, fillblank: fillblankBankG3U5b,
    word: listenWordBankG3U5b, sentence: listenSentenceBankG3U5b,
    order: listenOrderBankG3U5b, response: listenResponseBankG3U5b,
    translate: listenTranslateBankG3U5b,
  },
  unit5c: {
    quiz: quizBankG3U5c, fillblank: fillblankBankG3U5c,
    word: listenWordBankG3U5c, sentence: listenSentenceBankG3U5c,
    order: listenOrderBankG3U5c, response: listenResponseBankG3U5c,
    translate: listenTranslateBankG3U5c,
  },
  unit6a: {
    quiz: quizBankG3U6a, fillblank: fillblankBankG3U6a,
    word: listenWordBankG3U6a, sentence: listenSentenceBankG3U6a,
    order: listenOrderBankG3U6a, response: listenResponseBankG3U6a,
    translate: listenTranslateBankG3U6a,
  },
  unit6b: {
    quiz: quizBankG3U6b, fillblank: fillblankBankG3U6b,
    word: listenWordBankG3U6b, sentence: listenSentenceBankG3U6b,
    order: listenOrderBankG3U6b, response: listenResponseBankG3U6b,
    translate: listenTranslateBankG3U6b,
  },
  unit6c: {
    quiz: quizBankG3U6c, fillblank: fillblankBankG3U6c,
    word: listenWordBankG3U6c, sentence: listenSentenceBankG3U6c,
    order: listenOrderBankG3U6c, response: listenResponseBankG3U6c,
    translate: listenTranslateBankG3U6c,
  },
}

const BANKS_G3_DOWN = {
  unit1a: {
    quiz: quizBankG3D1a, fillblank: fillblankBankG3D1a,
    word: listenWordBankG3D1a, sentence: listenSentenceBankG3D1a,
    order: listenOrderBankG3D1a, response: listenResponseBankG3D1a,
    translate: listenTranslateBankG3D1a,
  },
  unit1b: {
    quiz: quizBankG3D1b, fillblank: fillblankBankG3D1b,
    word: listenWordBankG3D1b, sentence: listenSentenceBankG3D1b,
    order: listenOrderBankG3D1b, response: listenResponseBankG3D1b,
    translate: listenTranslateBankG3D1b,
  },
  unit1c: {
    quiz: quizBankG3D1c, fillblank: fillblankBankG3D1c,
    word: listenWordBankG3D1c, sentence: listenSentenceBankG3D1c,
    order: listenOrderBankG3D1c, response: listenResponseBankG3D1c,
    translate: listenTranslateBankG3D1c,
  },
  unit2a: {
    quiz: quizBankG3D2a, fillblank: fillblankBankG3D2a,
    word: listenWordBankG3D2a, sentence: listenSentenceBankG3D2a,
    order: listenOrderBankG3D2a, response: listenResponseBankG3D2a,
    translate: listenTranslateBankG3D2a,
  },
  unit2b: {
    quiz: quizBankG3D2b, fillblank: fillblankBankG3D2b,
    word: listenWordBankG3D2b, sentence: listenSentenceBankG3D2b,
    order: listenOrderBankG3D2b, response: listenResponseBankG3D2b,
    translate: listenTranslateBankG3D2b,
  },
  unit2c: {
    quiz: quizBankG3D2c, fillblank: fillblankBankG3D2c,
    word: listenWordBankG3D2c, sentence: listenSentenceBankG3D2c,
    order: listenOrderBankG3D2c, response: listenResponseBankG3D2c,
    translate: listenTranslateBankG3D2c,
  },
  unit3a: {
    quiz: quizBankG3D3a, fillblank: fillblankBankG3D3a,
    word: listenWordBankG3D3a, sentence: listenSentenceBankG3D3a,
    order: listenOrderBankG3D3a, response: listenResponseBankG3D3a,
    translate: listenTranslateBankG3D3a,
  },
  unit3b: {
    quiz: quizBankG3D3b, fillblank: fillblankBankG3D3b,
    word: listenWordBankG3D3b, sentence: listenSentenceBankG3D3b,
    order: listenOrderBankG3D3b, response: listenResponseBankG3D3b,
    translate: listenTranslateBankG3D3b,
  },
  unit3c: {
    quiz: quizBankG3D3c, fillblank: fillblankBankG3D3c,
    word: listenWordBankG3D3c, sentence: listenSentenceBankG3D3c,
    order: listenOrderBankG3D3c, response: listenResponseBankG3D3c,
    translate: listenTranslateBankG3D3c,
  },
  unit4a: {
    quiz: quizBankG3D4a, fillblank: fillblankBankG3D4a,
    word: listenWordBankG3D4a, sentence: listenSentenceBankG3D4a,
    order: listenOrderBankG3D4a, response: listenResponseBankG3D4a,
    translate: listenTranslateBankG3D4a,
  },
  unit4b: {
    quiz: quizBankG3D4b, fillblank: fillblankBankG3D4b,
    word: listenWordBankG3D4b, sentence: listenSentenceBankG3D4b,
    order: listenOrderBankG3D4b, response: listenResponseBankG3D4b,
    translate: listenTranslateBankG3D4b,
  },
  unit4c: {
    quiz: quizBankG3D4c, fillblank: fillblankBankG3D4c,
    word: listenWordBankG3D4c, sentence: listenSentenceBankG3D4c,
    order: listenOrderBankG3D4c, response: listenResponseBankG3D4c,
    translate: listenTranslateBankG3D4c,
  },
  unit5a: {
    quiz: quizBankG3D5a, fillblank: fillblankBankG3D5a,
    word: listenWordBankG3D5a, sentence: listenSentenceBankG3D5a,
    order: listenOrderBankG3D5a, response: listenResponseBankG3D5a,
    translate: listenTranslateBankG3D5a,
  },
  unit5b: {
    quiz: quizBankG3D5b, fillblank: fillblankBankG3D5b,
    word: listenWordBankG3D5b, sentence: listenSentenceBankG3D5b,
    order: listenOrderBankG3D5b, response: listenResponseBankG3D5b,
    translate: listenTranslateBankG3D5b,
  },
  unit5c: {
    quiz: quizBankG3D5c, fillblank: fillblankBankG3D5c,
    word: listenWordBankG3D5c, sentence: listenSentenceBankG3D5c,
    order: listenOrderBankG3D5c, response: listenResponseBankG3D5c,
    translate: listenTranslateBankG3D5c,
  },
  unit6a: {
    quiz: quizBankG3D6a, fillblank: fillblankBankG3D6a,
    word: listenWordBankG3D6a, sentence: listenSentenceBankG3D6a,
    order: listenOrderBankG3D6a, response: listenResponseBankG3D6a,
    translate: listenTranslateBankG3D6a,
  },
  unit6b: {
    quiz: quizBankG3D6b, fillblank: fillblankBankG3D6b,
    word: listenWordBankG3D6b, sentence: listenSentenceBankG3D6b,
    order: listenOrderBankG3D6b, response: listenResponseBankG3D6b,
    translate: listenTranslateBankG3D6b,
  },
  unit6c: {
    quiz: quizBankG3D6c, fillblank: fillblankBankG3D6c,
    word: listenWordBankG3D6c, sentence: listenSentenceBankG3D6c,
    order: listenOrderBankG3D6c, response: listenResponseBankG3D6c,
    translate: listenTranslateBankG3D6c,
  },
}

const BANKS_G4_UP = {
  unit1a: {
    quiz: quizBankG4U1a, fillblank: fillblankBankG4U1a,
    word: listenWordBankG4U1a, sentence: listenSentenceBankG4U1a,
    order: listenOrderBankG4U1a, response: listenResponseBankG4U1a,
    translate: listenTranslateBankG4U1a,
  },
  unit1b: {
    quiz: quizBankG4U1b, fillblank: fillblankBankG4U1b,
    word: listenWordBankG4U1b, sentence: listenSentenceBankG4U1b,
    order: listenOrderBankG4U1b, response: listenResponseBankG4U1b,
    translate: listenTranslateBankG4U1b,
  },
  unit1c: {
    quiz: quizBankG4U1c, fillblank: fillblankBankG4U1c,
    word: listenWordBankG4U1c, sentence: listenSentenceBankG4U1c,
    order: listenOrderBankG4U1c, response: listenResponseBankG4U1c,
    translate: listenTranslateBankG4U1c,
  },
  unit2a: {
    quiz: quizBankG4U2a, fillblank: fillblankBankG4U2a,
    word: listenWordBankG4U2a, sentence: listenSentenceBankG4U2a,
    order: listenOrderBankG4U2a, response: listenResponseBankG4U2a,
    translate: listenTranslateBankG4U2a,
  },
  unit2b: {
    quiz: quizBankG4U2b, fillblank: fillblankBankG4U2b,
    word: listenWordBankG4U2b, sentence: listenSentenceBankG4U2b,
    order: listenOrderBankG4U2b, response: listenResponseBankG4U2b,
    translate: listenTranslateBankG4U2b,
  },
  unit2c: {
    quiz: quizBankG4U2c, fillblank: fillblankBankG4U2c,
    word: listenWordBankG4U2c, sentence: listenSentenceBankG4U2c,
    order: listenOrderBankG4U2c, response: listenResponseBankG4U2c,
    translate: listenTranslateBankG4U2c,
  },
  unit3a: {
    quiz: quizBankG4U3a, fillblank: fillblankBankG4U3a,
    word: listenWordBankG4U3a, sentence: listenSentenceBankG4U3a,
    order: listenOrderBankG4U3a, response: listenResponseBankG4U3a,
    translate: listenTranslateBankG4U3a,
  },
  unit3b: {
    quiz: quizBankG4U3b, fillblank: fillblankBankG4U3b,
    word: listenWordBankG4U3b, sentence: listenSentenceBankG4U3b,
    order: listenOrderBankG4U3b, response: listenResponseBankG4U3b,
    translate: listenTranslateBankG4U3b,
  },
  unit3c: {
    quiz: quizBankG4U3c, fillblank: fillblankBankG4U3c,
    word: listenWordBankG4U3c, sentence: listenSentenceBankG4U3c,
    order: listenOrderBankG4U3c, response: listenResponseBankG4U3c,
    translate: listenTranslateBankG4U3c,
  },
  unit4a: {
    quiz: quizBankG4U4a, fillblank: fillblankBankG4U4a,
    word: listenWordBankG4U4a, sentence: listenSentenceBankG4U4a,
    order: listenOrderBankG4U4a, response: listenResponseBankG4U4a,
    translate: listenTranslateBankG4U4a,
  },
  unit4b: {
    quiz: quizBankG4U4b, fillblank: fillblankBankG4U4b,
    word: listenWordBankG4U4b, sentence: listenSentenceBankG4U4b,
    order: listenOrderBankG4U4b, response: listenResponseBankG4U4b,
    translate: listenTranslateBankG4U4b,
  },
  unit4c: {
    quiz: quizBankG4U4c, fillblank: fillblankBankG4U4c,
    word: listenWordBankG4U4c, sentence: listenSentenceBankG4U4c,
    order: listenOrderBankG4U4c, response: listenResponseBankG4U4c,
    translate: listenTranslateBankG4U4c,
  },
  unit5a: {
    quiz: quizBankG4U5a, fillblank: fillblankBankG4U5a,
    word: listenWordBankG4U5a, sentence: listenSentenceBankG4U5a,
    order: listenOrderBankG4U5a, response: listenResponseBankG4U5a,
    translate: listenTranslateBankG4U5a,
  },
  unit5b: {
    quiz: quizBankG4U5b, fillblank: fillblankBankG4U5b,
    word: listenWordBankG4U5b, sentence: listenSentenceBankG4U5b,
    order: listenOrderBankG4U5b, response: listenResponseBankG4U5b,
    translate: listenTranslateBankG4U5b,
  },
  unit5c: {
    quiz: quizBankG4U5c, fillblank: fillblankBankG4U5c,
    word: listenWordBankG4U5c, sentence: listenSentenceBankG4U5c,
    order: listenOrderBankG4U5c, response: listenResponseBankG4U5c,
    translate: listenTranslateBankG4U5c,
  },
  unit6a: {
    quiz: quizBankG4U6a, fillblank: fillblankBankG4U6a,
    word: listenWordBankG4U6a, sentence: listenSentenceBankG4U6a,
    order: listenOrderBankG4U6a, response: listenResponseBankG4U6a,
    translate: listenTranslateBankG4U6a,
  },
  unit6b: {
    quiz: quizBankG4U6b, fillblank: fillblankBankG4U6b,
    word: listenWordBankG4U6b, sentence: listenSentenceBankG4U6b,
    order: listenOrderBankG4U6b, response: listenResponseBankG4U6b,
    translate: listenTranslateBankG4U6b,
  },
  unit6c: {
    quiz: quizBankG4U6c, fillblank: fillblankBankG4U6c,
    word: listenWordBankG4U6c, sentence: listenSentenceBankG4U6c,
    order: listenOrderBankG4U6c, response: listenResponseBankG4U6c,
    translate: listenTranslateBankG4U6c,
  },
}

const BANKS_G4_DOWN = {
  unit1: {
    quiz: quizBank, fillblank: fillblankBank,
    word: listenWordBank, sentence: listenSentenceBank,
    order: listenOrderBank, response: listenResponseBank,
    translate: listenTranslateBank,
  },
  unit1b: {
    quiz: quizBank1b, fillblank: fillblankBank1b,
    word: listenWordBank1b, sentence: listenSentenceBank1b,
    order: listenOrderBank1b, response: listenResponseBank1b,
    translate: listenTranslateBank1b,
  },
  unit1c: {
    quiz: quizBank1c, fillblank: fillblankBank1c,
    word: listenWordBank1c, sentence: listenSentenceBank1c,
    order: listenOrderBank1c, response: listenResponseBank1c,
    translate: listenTranslateBank1c,
  },
  unit3a: {
    quiz: quizBank3a, fillblank: fillblankBank3a,
    word: listenWordBank3a, sentence: listenSentenceBank3a,
    order: listenOrderBank3a, response: listenResponseBank3a,
    translate: listenTranslateBank3a,
  },
  unit3b: {
    quiz: quizBank3b, fillblank: fillblankBank3b,
    word: listenWordBank3b, sentence: listenSentenceBank3b,
    order: listenOrderBank3b, response: listenResponseBank3b,
    translate: listenTranslateBank3b,
  },
  unit3c: {
    quiz: quizBank3c, fillblank: fillblankBank3c,
    word: listenWordBank3c, sentence: listenSentenceBank3c,
    order: listenOrderBank3c, response: listenResponseBank3c,
    translate: listenTranslateBank3c,
  },
  unit4a: {
    quiz: quizBank4a, fillblank: fillblankBank4a,
    word: listenWordBank4a, sentence: listenSentenceBank4a,
    order: listenOrderBank4a, response: listenResponseBank4a,
    translate: listenTranslateBank4a,
  },
  unit4b: {
    quiz: quizBank4b, fillblank: fillblankBank4b,
    word: listenWordBank4b, sentence: listenSentenceBank4b,
    order: listenOrderBank4b, response: listenResponseBank4b,
    translate: listenTranslateBank4b,
  },
  unit4c: {
    quiz: quizBank4c, fillblank: fillblankBank4c,
    word: listenWordBank4c, sentence: listenSentenceBank4c,
    order: listenOrderBank4c, response: listenResponseBank4c,
    translate: listenTranslateBank4c,
  },
  unit5a: {
    quiz: quizBank5a, fillblank: fillblankBank5a,
    word: listenWordBank5a, sentence: listenSentenceBank5a,
    order: listenOrderBank5a, response: listenResponseBank5a,
    translate: listenTranslateBank5a,
  },
  unit5b: {
    quiz: quizBank5b, fillblank: fillblankBank5b,
    word: listenWordBank5b, sentence: listenSentenceBank5b,
    order: listenOrderBank5b, response: listenResponseBank5b,
    translate: listenTranslateBank5b,
  },
  unit6a: {
    quiz: quizBank6a, fillblank: fillblankBank6a,
    word: listenWordBank6a, sentence: listenSentenceBank6a,
    order: listenOrderBank6a, response: listenResponseBank6a,
    translate: listenTranslateBank6a,
  },
  unit6b: {
    quiz: quizBank6b, fillblank: fillblankBank6b,
    word: listenWordBank6b, sentence: listenSentenceBank6b,
    order: listenOrderBank6b, response: listenResponseBank6b,
    translate: listenTranslateBank6b,
  },
  unit6c: {
    quiz: quizBank6c, fillblank: fillblankBank6c,
    word: listenWordBank6c, sentence: listenSentenceBank6c,
    order: listenOrderBank6c, response: listenResponseBank6c,
    translate: listenTranslateBank6c,
  },
  unit2a: {
    quiz: quizBank2a, fillblank: fillblankBank2a,
    word: listenWordBank2a, sentence: listenSentenceBank2a,
    order: listenOrderBank2a, response: listenResponseBank2a,
    translate: listenTranslateBank2a,
  },
  unit2b: {
    quiz: quizBank2b, fillblank: fillblankBank2b,
    word: listenWordBank2b, sentence: listenSentenceBank2b,
    order: listenOrderBank2b, response: listenResponseBank2b,
    translate: listenTranslateBank2b,
  },
  unit2c: {
    quiz: quizBank2c, fillblank: fillblankBank2c,
    word: listenWordBank2c, sentence: listenSentenceBank2c,
    order: listenOrderBank2c, response: listenResponseBank2c,
    translate: listenTranslateBank2c,
  },
}

const TYPE_LABEL = {
  quiz:             '选择题',
  fillblank:        '填空题',
  listen_word:      '听单词',
  listen_sentence:  '听句子',
  listen_order:     '连词成句',
  listen_response:  '听问答',
  listen_translate: '听翻译',
}

// ── 选择题 ────────────────────────────────────────────────────────────────────
function QuizCard({ q, onResult }) {
  const [selected, setSelected] = useState(null)
  const [resultPhase, setResultPhase] = useState(false)

  function choose(i) {
    if (resultPhase) return
    setSelected(i)
    setResultPhase(true)
    onResult(i === q.correct)
  }

  return (
    <div>
      <div className="flex items-start gap-3 mb-2">
        <p className="text-white text-xl font-medium leading-relaxed flex-1">{q.question}</p>
        <button onClick={() => speak(q.question)} className="text-blue-400 hover:text-blue-300 text-xl mt-0.5 shrink-0">🔊</button>
      </div>
      <p className="text-gray-400 text-base mb-6" style={{ fontFamily: 'KaiTi-Simplified, serif' }}>{q.chinese}</p>
      <div className="space-y-2">
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => choose(i)}
            disabled={resultPhase}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-base transition-colors flex items-center gap-3
              ${resultPhase
                ? i === q.correct
                  ? 'bg-green-800/50 border-2 border-green-500 text-green-200'
                  : i === selected
                  ? 'bg-red-800/50 border-2 border-red-500 text-red-200'
                  : 'bg-gray-800 border-2 border-transparent text-gray-500'
                : selected === i
                ? 'bg-blue-800/50 border-2 border-blue-500 text-white'
                : 'bg-gray-800 border-2 border-transparent text-white hover:border-blue-500/50 hover:bg-blue-900/10'}`}>
            <span className="font-mono text-sm opacity-60 shrink-0">{String.fromCharCode(65 + i)}</span>
            <span>{opt}</span>
            <button onClick={e => { e.stopPropagation(); speak(opt) }}
              className="ml-auto text-blue-400/60 hover:text-blue-300 text-sm shrink-0">🔊</button>
          </button>
        ))}
      </div>
      {resultPhase && q.explanation && (
        <div className="mt-4 bg-gray-800/60 rounded-xl px-4 py-3 text-sm text-gray-300">
          💡 {q.explanation}
        </div>
      )}
    </div>
  )
}

// ── 填空题 ────────────────────────────────────────────────────────────────────
function FillBlankCard({ q, onResult, requireSpeak }) {
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState(null)

  const [unlocked, setUnlocked] = useState(!requireSpeak)
  const [isRecording, setIsRecording] = useState(false)
  const [recognizingResult, setRecognizingResult] = useState('')
  useEffect(() => {
    setUnlocked(!requireSpeak)
  }, [requireSpeak])

  const recognitionRef = useRef(null);

  const toggleListening = async () => {
    console.log('🎤 toggleListening logic triggered, isRecording:', isRecording);
    setRecognizingResult('正在检查麦克风权限...');

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("您的浏览器不支持语音识别，请尝试使用 Chrome 浏览器或关闭系统设置中的强制跟读功能。");
      setUnlocked(true);
      return;
    }

    try {
      // 显式请求麦克风权限
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('🎤 录音开始');
        setIsRecording(true);
        setRecognizingResult('🎤 正在录音... (空格键完成)');
      };

      recognition.onerror = (event) => {
        console.error('❌ 语音识别错误:', event.error);
        const errorMap = {
          'not-allowed': '麦克风权限被拒绝',
          'service-not-allowed': '识别库服务不可用 (建议使用 Chrome)',
          'network': '网络连接错误 (识别服务需连网)',
          'no-speech': '未检测到说话声音',
          'aborted': '识别被中止'
        };
        setRecognizingResult(`❌ 错误: ${errorMap[event.error] || event.error}`);
      };

      recognition.onresult = (event) => {
        console.log('✅ 收到识别结果');
        const transcript = event.results[0][0].transcript;
        setRecognizingResult(`听到: "${transcript}"`);
        handleTranscription(transcript);
      };

      recognition.onend = () => {
        console.log('🏁 录音结束');
        setIsRecording(false);
        recognitionRef.current = null;
      };

      recognition.start();
    } catch (err) {
      console.error('❌ 麦克风访问失败:', err);
      setRecognizingResult(`❌ 无法访问麦克风: ${err.message === 'Permission denied' ? '权限被拒绝' : err.message}`);
    }
  }

  const handleTranscription = (transcript) => {
    const ansWords = q.answer.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).filter(Boolean);
    const transWords = transcript.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).filter(Boolean);
    
    let matchCount = 0;
    for (const w of ansWords) {
      if (transWords.includes(w)) matchCount++;
    }
    
    const isMatch = ansWords.length === 0 || (matchCount / (ansWords.length || 1)) >= 0.5;
    if (isMatch) {
      setTimeout(() => setUnlocked(true), 500); 
    } else {
      setTimeout(() => setRecognizingResult('匹配度较低，请再试一次'), 1500);
    }
  };

  const toggleRef = useRef(toggleListening);
  useEffect(() => { toggleRef.current = toggleListening; });

  useEffect(() => {
    const handleSpace = (e) => {
      if (e.key === ' ' || e.code === 'Space') {
        if (unlocked) return;
        if (e.repeat) return;
        e.preventDefault();
        console.log('⌨️ Space detected, calling toggleListening');
        toggleRef.current();
      }
    };
    window.addEventListener('keydown', handleSpace, true); // 使用捕获阶段确保优先处理
    return () => window.removeEventListener('keydown', handleSpace, true);
  }, [unlocked]);

  function submit() {
    if (!input.trim()) return
    const ok = input.trim().toLowerCase() === q.answer.toLowerCase()
    setCorrect(ok)
    setSubmitted(true)
    onResult(ok)
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <p className="text-white text-xl font-medium leading-relaxed flex-1"
          style={{ fontFamily: 'monospace' }}>{q.sentence}</p>
        <button onClick={() => speak(q.sentence.replace('___', q.answer))}
          className="text-blue-400 hover:text-blue-300 text-xl shrink-0">🔊</button>
      </div>
      <p className="text-gray-400 text-base mb-6" style={{ fontFamily: 'KaiTi-Simplified, serif' }}>{q.chinese}</p>

     { !unlocked ? (
      <div className="flex flex-col items-center gap-4 py-12 max-w-sm mx-auto bg-gray-900 rounded-3xl border border-gray-800 shadow-xl px-4">
        <div className="text-2xl md:text-3xl font-medium text-white text-center leading-relaxed mb-1" style={{ fontFamily: 'AI Nile, monospace' }}>
          {q.answer}
        </div>
        <button 
          onClick={toggleListening}
            className={`w-14 h-14 rounded-full flex flex-col justify-center items-center text-xl shadow-lg transition-all relative
              ${isRecording ? 'bg-red-500 animate-pulse text-white' : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'}`}
          >
            <span>🎤</span>
            <span className="text-[10px] absolute -bottom-6 w-20 text-gray-500 font-normal">空格键录音</span>
          </button>
          <div className={`text-center font-medium px-4 ${recognizingResult?.startsWith('❌') ? 'text-red-400' : 'text-blue-400 opacity-80'}`}>
            {recognizingResult || '点击麦克风或按空格录音'}
            <div className="mt-4">
              <button
                onClick={(e) => { e.stopPropagation(); setUnlocked(true); setRecognizingResult('已切换到手动模式'); }}
                className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-xl border border-gray-700 transition-all active:scale-95 shadow-lg"
              >
                点此跳过录音，直接输入答案
              </button>
            </div>
          </div>
        </div>
      ) : !submitted ? (
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="输入答案 (Enter 提交)"
          autoFocus
          className="w-full bg-gray-800 border-2 border-gray-700 focus:border-blue-500 rounded-xl px-4 py-3 text-white text-lg outline-none transition-colors"
        />
      ) : (
        <div className={`rounded-xl px-4 py-3 text-base font-semibold
          ${correct ? 'bg-green-900/40 border-2 border-green-600 text-green-300' : 'bg-red-900/40 border-2 border-red-600 text-red-300'}`}>
          {correct ? '✓ 正确！' : `✗ 正确答案：${q.answer}`}
        </div>
      )}
      {submitted && q.explanation && (
        <div className="mt-4 bg-gray-800/60 rounded-xl px-4 py-3 text-sm text-gray-300">
          💡 {q.explanation}
        </div>
      )}
    </div>
  )
}

// ── 连词成句 ──────────────────────────────────────────────────────────────────
function WordOrderCard({ q, onResult }) {
  const [arranged, setArranged] = useState([])
  const [pool, setPool] = useState(() => {
    const arr = [...q.words]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  })
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState(null)

  function addWord(idx) {
    if (submitted) return
    setPool(p => p.filter((_, i) => i !== idx))
    setArranged(a => [...a, pool[idx]])
  }
  function removeWord(idx) {
    if (submitted) return
    setPool(p => [...p, arranged[idx]])
    setArranged(a => a.filter((_, i) => i !== idx))
  }
  function submit() {
    const ok = arranged.join(' ') === q.answer.join(' ')
    setCorrect(ok)
    setSubmitted(true)
    onResult(ok)
  }

  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'Enter' && !submitted && arranged.length > 0) {
        submit()
      }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [submitted, arranged])

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <p className="text-gray-300 text-base">{q.zh}</p>
        <button onClick={() => speak(q.sentence)} className="text-blue-400 hover:text-blue-300 text-xl shrink-0">🔊</button>
      </div>
      <div className="min-h-14 bg-gray-800 border-2 border-gray-700 rounded-2xl px-4 py-3 flex flex-wrap gap-2 mb-4 mt-4">
        {arranged.length === 0 && <span className="text-gray-600 text-base">点击下方单词排列</span>}
        {arranged.map((w, i) => (
          <button key={i} onClick={() => removeWord(i)} disabled={submitted}
            className={`px-4 py-2 rounded-xl text-base font-medium transition-colors
              ${submitted ? correct ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'
                : 'bg-blue-700 hover:bg-blue-600 text-white'}`}>
            {w}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {pool.map((w, i) => (
          <button key={i} onClick={() => addWord(i)} disabled={submitted}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-base font-medium transition-colors disabled:opacity-40">
            {w}
          </button>
        ))}
      </div>
      {submitted && !correct && (
        <div className="text-base text-gray-400 mb-3">正确答案：<span className="text-white">{q.answer.join(' ')}</span></div>
      )}
      {!submitted && (
        <button onClick={submit} disabled={arranged.length === 0}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-lg font-semibold rounded-2xl transition-colors">
          提交
        </button>
      )}
    </div>
  )
}

// ── 听力选择题（通用）────────────────────────────────────────────────────────
function ListenChoiceCard({ q, type, onResult }) {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const textToSpeak = type === 'listen_word' ? q.word
    : type === 'listen_sentence' ? q.sentence
    : type === 'listen_response' ? q.question
    : q.sentence  // listen_translate

  function choose(i) {
    if (submitted) return
    setSelected(i)
    setSubmitted(true)
    onResult(i === q.correct)
  }

  return (
    <div>
      <div className="flex justify-center mb-4">
        <button onClick={() => speak(textToSpeak)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 flex items-center justify-center text-xl transition-all shadow-lg shadow-blue-900/40">
          🔊
        </button>
      </div>
      {type === 'listen_response' && (
        <p className="text-center text-gray-400 text-base mb-4">{q.zh}</p>
      )}
      {type === 'listen_word' && q.zh && (
        <p className="text-center text-gray-400 text-base mb-1" style={{ fontFamily: 'KaiTi-Simplified, serif' }}>{q.zh}</p>
      )}
      <div className="space-y-2">
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => choose(i)} disabled={submitted}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-base transition-colors
              ${submitted
                ? i === q.correct
                  ? 'bg-green-800/50 border-2 border-green-500 text-green-200'
                  : i === selected
                  ? 'bg-red-800/50 border-2 border-red-500 text-red-200'
                  : 'bg-gray-800 border-2 border-transparent text-gray-500'
                : 'bg-gray-800 border-2 border-transparent text-white hover:border-blue-500/50 hover:bg-blue-900/10'}`}>
            <span className="font-mono text-sm opacity-60 mr-2">{String.fromCharCode(65 + i)}.</span>
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Grade 5 Banks ─────────────────────────────────────────────────────────────
const BANKS_G5_UP = {
  unit1a: {
    quiz: quizBankG5U1a, fillblank: fillblankBankG5U1a, word: listenWordBankG5U1a, sentence: listenSentenceBankG5U1a, order: listenOrderBankG5U1a, response: listenResponseBankG5U1a, translate: listenTranslateBankG5U1a,
  },
  unit1b: {
    quiz: quizBankG5U1b, fillblank: fillblankBankG5U1b, word: listenWordBankG5U1b, sentence: listenSentenceBankG5U1b, order: listenOrderBankG5U1b, response: listenResponseBankG5U1b, translate: listenTranslateBankG5U1b,
  },
  unit1c: {
    quiz: quizBankG5U1c, fillblank: fillblankBankG5U1c, word: listenWordBankG5U1c, sentence: listenSentenceBankG5U1c, order: listenOrderBankG5U1c, response: listenResponseBankG5U1c, translate: listenTranslateBankG5U1c,
  },
  unit2a: {
    quiz: quizBankG5U2a, fillblank: fillblankBankG5U2a, word: listenWordBankG5U2a, sentence: listenSentenceBankG5U2a, order: listenOrderBankG5U2a, response: listenResponseBankG5U2a, translate: listenTranslateBankG5U2a,
  },
  unit2b: {
    quiz: quizBankG5U2b, fillblank: fillblankBankG5U2b, word: listenWordBankG5U2b, sentence: listenSentenceBankG5U2b, order: listenOrderBankG5U2b, response: listenResponseBankG5U2b, translate: listenTranslateBankG5U2b,
  },
  unit2c: {
    quiz: quizBankG5U2c, fillblank: fillblankBankG5U2c, word: listenWordBankG5U2c, sentence: listenSentenceBankG5U2c, order: listenOrderBankG5U2c, response: listenResponseBankG5U2c, translate: listenTranslateBankG5U2c,
  },
  unit3a: {
    quiz: quizBankG5U3a, fillblank: fillblankBankG5U3a, word: listenWordBankG5U3a, sentence: listenSentenceBankG5U3a, order: listenOrderBankG5U3a, response: listenResponseBankG5U3a, translate: listenTranslateBankG5U3a,
  },
  unit3b: {
    quiz: quizBankG5U3b, fillblank: fillblankBankG5U3b, word: listenWordBankG5U3b, sentence: listenSentenceBankG5U3b, order: listenOrderBankG5U3b, response: listenResponseBankG5U3b, translate: listenTranslateBankG5U3b,
  },
  unit3c: {
    quiz: quizBankG5U3c, fillblank: fillblankBankG5U3c, word: listenWordBankG5U3c, sentence: listenSentenceBankG5U3c, order: listenOrderBankG5U3c, response: listenResponseBankG5U3c, translate: listenTranslateBankG5U3c,
  },
  unit4a: {
    quiz: quizBankG5U4a, fillblank: fillblankBankG5U4a, word: listenWordBankG5U4a, sentence: listenSentenceBankG5U4a, order: listenOrderBankG5U4a, response: listenResponseBankG5U4a, translate: listenTranslateBankG5U4a,
  },
  unit4b: {
    quiz: quizBankG5U4b, fillblank: fillblankBankG5U4b, word: listenWordBankG5U4b, sentence: listenSentenceBankG5U4b, order: listenOrderBankG5U4b, response: listenResponseBankG5U4b, translate: listenTranslateBankG5U4b,
  },
  unit4c: {
    quiz: quizBankG5U4c, fillblank: fillblankBankG5U4c, word: listenWordBankG5U4c, sentence: listenSentenceBankG5U4c, order: listenOrderBankG5U4c, response: listenResponseBankG5U4c, translate: listenTranslateBankG5U4c,
  },
  unit5a: {
    quiz: quizBankG5U5a, fillblank: fillblankBankG5U5a, word: listenWordBankG5U5a, sentence: listenSentenceBankG5U5a, order: listenOrderBankG5U5a, response: listenResponseBankG5U5a, translate: listenTranslateBankG5U5a,
  },
  unit5b: {
    quiz: quizBankG5U5b, fillblank: fillblankBankG5U5b, word: listenWordBankG5U5b, sentence: listenSentenceBankG5U5b, order: listenOrderBankG5U5b, response: listenResponseBankG5U5b, translate: listenTranslateBankG5U5b,
  },
  unit5c: {
    quiz: quizBankG5U5c, fillblank: fillblankBankG5U5c, word: listenWordBankG5U5c, sentence: listenSentenceBankG5U5c, order: listenOrderBankG5U5c, response: listenResponseBankG5U5c, translate: listenTranslateBankG5U5c,
  },
  unit6a: {
    quiz: quizBankG5U6a, fillblank: fillblankBankG5U6a, word: listenWordBankG5U6a, sentence: listenSentenceBankG5U6a, order: listenOrderBankG5U6a, response: listenResponseBankG5U6a, translate: listenTranslateBankG5U6a,
  },
  unit6b: {
    quiz: quizBankG5U6b, fillblank: fillblankBankG5U6b, word: listenWordBankG5U6b, sentence: listenSentenceBankG5U6b, order: listenOrderBankG5U6b, response: listenResponseBankG5U6b, translate: listenTranslateBankG5U6b,
  },
  unit6c: {
    quiz: quizBankG5U6c, fillblank: fillblankBankG5U6c, word: listenWordBankG5U6c, sentence: listenSentenceBankG5U6c, order: listenOrderBankG5U6c, response: listenResponseBankG5U6c, translate: listenTranslateBankG5U6c,
  },
}

const BANKS_G5_DOWN = {
  unit1a: {
    quiz: quizBankG5D1a, fillblank: fillblankBankG5D1a, word: listenWordBankG5D1a, sentence: listenSentenceBankG5D1a, order: listenOrderBankG5D1a, response: listenResponseBankG5D1a, translate: listenTranslateBankG5D1a,
  },
  unit1b: {
    quiz: quizBankG5D1b, fillblank: fillblankBankG5D1b, word: listenWordBankG5D1b, sentence: listenSentenceBankG5D1b, order: listenOrderBankG5D1b, response: listenResponseBankG5D1b, translate: listenTranslateBankG5D1b,
  },
  unit1c: {
    quiz: quizBankG5D1c, fillblank: fillblankBankG5D1c, word: listenWordBankG5D1c, sentence: listenSentenceBankG5D1c, order: listenOrderBankG5D1c, response: listenResponseBankG5D1c, translate: listenTranslateBankG5D1c,
  },
  unit2a: {
    quiz: quizBankG5D2a, fillblank: fillblankBankG5D2a, word: listenWordBankG5D2a, sentence: listenSentenceBankG5D2a, order: listenOrderBankG5D2a, response: listenResponseBankG5D2a, translate: listenTranslateBankG5D2a,
  },
  unit2b: {
    quiz: quizBankG5D2b, fillblank: fillblankBankG5D2b, word: listenWordBankG5D2b, sentence: listenSentenceBankG5D2b, order: listenOrderBankG5D2b, response: listenResponseBankG5D2b, translate: listenTranslateBankG5D2b,
  },
  unit2c: {
    quiz: quizBankG5D2c, fillblank: fillblankBankG5D2c, word: listenWordBankG5D2c, sentence: listenSentenceBankG5D2c, order: listenOrderBankG5D2c, response: listenResponseBankG5D2c, translate: listenTranslateBankG5D2c,
  },
  unit3a: {
    quiz: quizBankG5D3a, fillblank: fillblankBankG5D3a, word: listenWordBankG5D3a, sentence: listenSentenceBankG5D3a, order: listenOrderBankG5D3a, response: listenResponseBankG5D3a, translate: listenTranslateBankG5D3a,
  },
  unit3b: {
    quiz: quizBankG5D3b, fillblank: fillblankBankG5D3b, word: listenWordBankG5D3b, sentence: listenSentenceBankG5D3b, order: listenOrderBankG5D3b, response: listenResponseBankG5D3b, translate: listenTranslateBankG5D3b,
  },
  unit3c: {
    quiz: quizBankG5D3c, fillblank: fillblankBankG5D3c, word: listenWordBankG5D3c, sentence: listenSentenceBankG5D3c, order: listenOrderBankG5D3c, response: listenResponseBankG5D3c, translate: listenTranslateBankG5D3c,
  },
  unit4a: {
    quiz: quizBankG5D4a, fillblank: fillblankBankG5D4a, word: listenWordBankG5D4a, sentence: listenSentenceBankG5D4a, order: listenOrderBankG5D4a, response: listenResponseBankG5D4a, translate: listenTranslateBankG5D4a,
  },
  unit4b: {
    quiz: quizBankG5D4b, fillblank: fillblankBankG5D4b, word: listenWordBankG5D4b, sentence: listenSentenceBankG5D4b, order: listenOrderBankG5D4b, response: listenResponseBankG5D4b, translate: listenTranslateBankG5D4b,
  },
  unit4c: {
    quiz: quizBankG5D4c, fillblank: fillblankBankG5D4c, word: listenWordBankG5D4c, sentence: listenSentenceBankG5D4c, order: listenOrderBankG5D4c, response: listenResponseBankG5D4c, translate: listenTranslateBankG5D4c,
  },
  unit5a: {
    quiz: quizBankG5D5a, fillblank: fillblankBankG5D5a, word: listenWordBankG5D5a, sentence: listenSentenceBankG5D5a, order: listenOrderBankG5D5a, response: listenResponseBankG5D5a, translate: listenTranslateBankG5D5a,
  },
  unit5b: {
    quiz: quizBankG5D5b, fillblank: fillblankBankG5D5b, word: listenWordBankG5D5b, sentence: listenSentenceBankG5D5b, order: listenOrderBankG5D5b, response: listenResponseBankG5D5b, translate: listenTranslateBankG5D5b,
  },
  unit5c: {
    quiz: quizBankG5D5c, fillblank: fillblankBankG5D5c, word: listenWordBankG5D5c, sentence: listenSentenceBankG5D5c, order: listenOrderBankG5D5c, response: listenResponseBankG5D5c, translate: listenTranslateBankG5D5c,
  },
  unit6a: {
    quiz: quizBankG5D6a, fillblank: fillblankBankG5D6a, word: listenWordBankG5D6a, sentence: listenSentenceBankG5D6a, order: listenOrderBankG5D6a, response: listenResponseBankG5D6a, translate: listenTranslateBankG5D6a,
  },
  unit6b: {
    quiz: quizBankG5D6b, fillblank: fillblankBankG5D6b, word: listenWordBankG5D6b, sentence: listenSentenceBankG5D6b, order: listenOrderBankG5D6b, response: listenResponseBankG5D6b, translate: listenTranslateBankG5D6b,
  },
  unit6c: {
    quiz: quizBankG5D6c, fillblank: fillblankBankG5D6c, word: listenWordBankG5D6c, sentence: listenSentenceBankG5D6c, order: listenOrderBankG5D6c, response: listenResponseBankG5D6c, translate: listenTranslateBankG5D6c,
  },
}

// ── 主流程 ────────────────────────────────────────────────────────────────────
export default function Unit1Flow({ unitLabel, bookId, requireSpeak, onClose }) {
  const questions = useMemo(() => {
    const label = unitLabel?.toLowerCase() ?? ''
    
    // Choose the active bank based on the passed in bookId
    let activeBanks = BANKS_G4_DOWN
    if (bookId === 'grade4_up') activeBanks = BANKS_G4_UP
    else if (bookId === 'grade3_up') activeBanks = BANKS_G3_UP
    else if (bookId === 'grade3_down') activeBanks = BANKS_G3_DOWN
    else if (bookId === 'grade5_up') activeBanks = BANKS_G5_UP
    else if (bookId === 'grade5_down') activeBanks = BANKS_G5_DOWN

    let key = 'unit1'
    if (label.includes('1a') || label === 'unit 1') key = 'unit1a'
    else if (label.includes('1b')) key = 'unit1b'
    else if (label.includes('1c')) key = 'unit1c'
    else if (label.includes('2a') || label === 'unit 2') key = 'unit2a'
    else if (label.includes('2b')) key = 'unit2b'
    else if (label.includes('2c')) key = 'unit2c'
    else if (label.includes('3a') || label === 'unit 3') key = 'unit3a'
    else if (label.includes('3b')) key = 'unit3b'
    else if (label.includes('3c')) key = 'unit3c'
    else if (label.includes('4a') || label === 'unit 4') key = 'unit4a'
    else if (label.includes('4b')) key = 'unit4b'
    else if (label.includes('4c')) key = 'unit4c'
    else if (label.includes('5a') || label === 'unit 5') key = 'unit5a'
    else if (label.includes('5b')) key = 'unit5b'
    else if (label.includes('5c')) key = 'unit5c'
    else if (label.includes('6a') || label === 'unit 6') key = 'unit6a'
    else if (label.includes('6b')) key = 'unit6b'
    else if (label.includes('6c')) key = 'unit6c'
    
    // Also handle Grade 4 Up 'Unit 3' special case if needed
    if (label === 'unit 3' && bookId === 'grade4_up') key = 'unit3'
    if (label === 'unit 4' && bookId === 'grade4_up') key = 'unit4'
    
    // Fallbacks just in case
    const bankSet = activeBanks[key] || activeBanks.unit1a || activeBanks.unit1;
    return buildQuestions(bankSet)
  }, [unitLabel, bookId])
  const total = questions.length
  const [current, setCurrent] = useState(0)
  const [scores, setScores] = useState([])
  const [pendingResult, setPendingResult] = useState(null)
  const [done, setDone] = useState(false)

  // Guard against empty questions
  if (total === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="text-4xl mb-4">🙊</div>
        <h2 className="text-xl font-bold mb-2">暂无练习数据</h2>
        <p className="text-gray-500 mb-6">该单元（{unitLabel}）暂未配置同步练习题库。</p>
        <button onClick={onClose} className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-2xl transition-colors">
          返回目录
        </button>
      </div>
    )
  }

  const q = questions[current]

  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'Enter' && pendingResult !== null) {
        handleNext()
      }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [pendingResult, current, total])

  function handleResult(isCorrect) {
    setPendingResult(isCorrect)
  }

  function handleNext() {
    const newScores = [...scores, pendingResult]
    if (current < total - 1) {
      setScores(newScores)
      setCurrent(c => c + 1)
      setPendingResult(null)
    } else {
      setScores(newScores)
      setDone(true)
    }
  }

  if (done) {
    const correct = scores.filter(Boolean).length
    const pct = Math.round((correct / total) * 100)
    return (
      <div className="fixed inset-0 z-40 bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">{pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪'}</div>
          <div className="text-3xl font-bold text-white mb-1">全部完成！</div>
          <div className="text-gray-400 mb-6">{unitLabel} · {total} 道题</div>
          <div className="text-6xl font-bold text-blue-400 mb-1">{correct}<span className="text-3xl text-gray-500">/{total}</span></div>
          <div className="text-gray-500 mb-8">正确率 {pct}%</div>
          <button onClick={onClose}
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-2xl text-lg font-medium transition-colors">
            返回
          </button>
        </div>
      </div>
    )
  }

  if (!q) return null

  const typeLabel = TYPE_LABEL[q.type]

  return (
    <div className="fixed inset-0 z-40 bg-black flex flex-col">
      {/* 顶栏 */}
      <div className="shrink-0 px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-gray-500 uppercase tracking-wider">{unitLabel} · {typeLabel}</div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 tabular-nums">{current + 1} / {total}</span>
            <button onClick={onClose} className="text-gray-600 hover:text-white text-lg transition-colors">✕</button>
          </div>
        </div>
        {/* 进度条 */}
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${(current / total) * 100}%` }} />
        </div>
      </div>

      {/* 题目卡片区（可内部滚动）*/}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 max-w-lg mx-auto">
          {q.type === 'quiz' && <QuizCard key={current} q={q.data} onResult={handleResult} />}
          {q.type === 'fillblank' && <FillBlankCard key={current} q={q.data} requireSpeak={requireSpeak} onResult={handleResult} />}
          {q.type === 'listen_order' && <WordOrderCard key={current} q={q.data} onResult={handleResult} />}
          {(q.type === 'listen_word' || q.type === 'listen_sentence' || q.type === 'listen_response' || q.type === 'listen_translate') &&
            <ListenChoiceCard key={current} q={q.data} type={q.type} onResult={handleResult} />}
        </div>
      </div>

      {/* 底部区：结果反馈 + 下一题按钮 */}
      <div className="shrink-0 px-4 pb-6 pt-2 border-t border-gray-800/60 max-w-lg mx-auto w-full">
        {pendingResult !== null && (
          <div className={`rounded-xl px-4 py-2.5 mb-2.5 text-sm font-medium
            ${pendingResult
              ? 'bg-green-900/40 border border-green-700 text-green-300'
              : 'bg-red-900/40 border border-red-700 text-red-300'}`}>
            {pendingResult ? '✓ 正确！' : '✗ 回答错误'}
          </div>
        )}
        {pendingResult !== null && (
          <button onClick={handleNext}
            className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl shadow-lg transition-transform active:scale-95 text-xl">
            {current < total - 1 ? '下一题 (Enter) →' : '查看结果 (Enter)'}
          </button>
        )}
      </div>
    </div>
  )
}
