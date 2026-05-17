import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { useDiscreetMode } from '../lib/discreetMode';

/**
 * Calculatrice fonctionnelle qui sert d'écran de couverture en mode discret.
 * Geste secret pour ressortir : triple tap (3 taps rapides en moins de 800ms) sur "=".
 */
export default function DiscreetCalculator() {
  const { deactivate } = useDiscreetMode();
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [waitingNext, setWaitingNext] = useState(false);

  const tapsRef = useRef<number[]>([]);

  function inputDigit(d: string) {
    if (waitingNext) { setDisplay(d); setWaitingNext(false); }
    else setDisplay(display === '0' ? d : display + d);
  }

  function inputDot() {
    if (waitingNext) { setDisplay('0.'); setWaitingNext(false); return; }
    if (!display.includes('.')) setDisplay(display + '.');
  }

  function clear() { setDisplay('0'); setPrev(null); setOp(null); setWaitingNext(false); }

  function perform(o: string) {
    const cur = parseFloat(display);
    if (prev != null && op && !waitingNext) {
      const r = calc(prev, cur, op);
      setDisplay(String(r));
      setPrev(r);
    } else {
      setPrev(cur);
    }
    setOp(o);
    setWaitingNext(true);
  }

  function calc(a: number, b: number, o: string): number {
    switch (o) { case '+': return a + b; case '-': return a - b; case '×': return a * b; case '÷': return b === 0 ? 0 : a / b; }
    return b;
  }

  function equals() {
    // Triple tap secret pour ressortir
    const now = Date.now();
    tapsRef.current = [...tapsRef.current.filter(t => now - t < 800), now];
    if (tapsRef.current.length >= 3) {
      tapsRef.current = [];
      deactivate();
      return;
    }

    if (prev == null || op == null) return;
    const cur = parseFloat(display);
    const r = calc(prev, cur, op);
    setDisplay(String(r));
    setPrev(null);
    setOp(null);
    setWaitingNext(true);
  }

  function toggleSign() { setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display); }
  function percent() { setDisplay(String(parseFloat(display) / 100)); }

  const Btn = ({ label, onPress, style, textStyle }: { label: string; onPress: () => void; style?: any; textStyle?: any }) => (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress} style={[styles.btn, style]}>
      <Text style={[styles.btnText, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.displayBox}>
        <Text style={styles.display} numberOfLines={1} adjustsFontSizeToFit>{display}</Text>
      </View>
      <View style={styles.grid}>
        <View style={styles.row}>
          <Btn label="AC" onPress={clear} style={styles.gray} textStyle={styles.darkText} />
          <Btn label="±" onPress={toggleSign} style={styles.gray} textStyle={styles.darkText} />
          <Btn label="%" onPress={percent} style={styles.gray} textStyle={styles.darkText} />
          <Btn label="÷" onPress={() => perform('÷')} style={styles.orange} />
        </View>
        <View style={styles.row}>
          <Btn label="7" onPress={() => inputDigit('7')} />
          <Btn label="8" onPress={() => inputDigit('8')} />
          <Btn label="9" onPress={() => inputDigit('9')} />
          <Btn label="×" onPress={() => perform('×')} style={styles.orange} />
        </View>
        <View style={styles.row}>
          <Btn label="4" onPress={() => inputDigit('4')} />
          <Btn label="5" onPress={() => inputDigit('5')} />
          <Btn label="6" onPress={() => inputDigit('6')} />
          <Btn label="-" onPress={() => perform('-')} style={styles.orange} />
        </View>
        <View style={styles.row}>
          <Btn label="1" onPress={() => inputDigit('1')} />
          <Btn label="2" onPress={() => inputDigit('2')} />
          <Btn label="3" onPress={() => inputDigit('3')} />
          <Btn label="+" onPress={() => perform('+')} style={styles.orange} />
        </View>
        <View style={styles.row}>
          <Btn label="0" onPress={() => inputDigit('0')} style={styles.wide} />
          <Btn label="." onPress={inputDot} />
          <Btn label="=" onPress={equals} style={styles.orange} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'flex-end' },
  displayBox: { padding: 24, alignItems: 'flex-end', minHeight: 140, justifyContent: 'flex-end' },
  display: { color: '#fff', fontSize: 72, fontWeight: '200' },
  grid: { padding: 8, paddingBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  btn: { flex: 1, height: 72, marginHorizontal: 4, borderRadius: 36, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' },
  wide: { flex: 2.2, alignItems: 'flex-start', paddingLeft: 32 },
  btnText: { color: '#fff', fontSize: 32, fontWeight: '400' },
  orange: { backgroundColor: '#FF9500' },
  gray: { backgroundColor: '#A5A5A5' },
  darkText: { color: '#000' },
});
