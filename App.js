import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, I18nManager } from "react-native";

I18nManager.forceRTL(true); // تنظیم راست‌چین بودن کل متن‌ها

const targetWord = "گربه ماهی"; // کلمه هدف
const maxAttempts = 6; // تعداد حدس‌ها

const WordGuessGame = () => {
  
  const [attempts, setAttempts] = useState(Array(maxAttempts).fill(null)); // ذخیره حدس‌های قبلی
  const [activeRow, setActiveRow] = useState(0); // ردیف فعال
  const [currentGuess, setCurrentGuess] = useState(""); // حدس فعلی
  const inputRef = useRef(null); // رفرنس برای کنترل کیبورد

  const checkWord = () => {
    if (currentGuess.length !== targetWord.length) {
      alert(`کلمه باید ${targetWord.length} حرفی باشد!`);
      return;
    }
    console.log(currentGuess)

    // بررسی وضعیت حروف (سبز = درست، زرد = جایگاه غلط، قرمز = نیست)
    const feedback = currentGuess.split("").map((char, index) => {
      if (char === targetWord[index]) return { char, color: "green" };
      if (targetWord.includes(char)) return { char, color: "yellow" };
      return { char, color: "red" };
    });

    const newAttempts = [...attempts];
    newAttempts[activeRow] = feedback;
    setAttempts(newAttempts);
    setCurrentGuess("");

    // چک کردن برنده شدن یا تمام شدن بازی
    if (currentGuess === targetWord) {
      Alert.alert("تبریک!", "عالی بودی! 🎉");
    } else if (activeRow + 1 >= maxAttempts) {
      Alert.alert("باختی! Ghahve on u!", `کلمه درست: ${targetWord}`);
    } else {
      setActiveRow(activeRow + 1); // رفتن به ردیف بعدی
    }
  };

  const resetGame = () => {
    setAttempts(Array(maxAttempts).fill(null)); // فقط حدس‌ها رو ریست می‌کنیم
    setActiveRow(0); // به ردیف اول برمی‌گردیم
    setCurrentGuess(""); // حدس فعلی رو پاک می‌کنیم

    // باز کردن کیبورد بعد از ریست کردن بازی
    setTimeout(() => {
      setActiveRow(0); // به ردیف اول برگشت
      setCurrentGuess(""); // مقدار حدس فعلی رو پاک کن
      inputRef.current?.focus(); // فعال کردن اولین ردیف بعد از ریست و باز کردن کیبورد
    }, 100); // تأخیر 100 میلی‌ثانیه برای اطمینان از باز شدن کیبورد
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>بازی حدس کلمه</Text>

      {Array.from({ length: maxAttempts }).map((_, rowIndex) => (
        <TouchableOpacity
          key={rowIndex}
          onPress={() => {
            setActiveRow(rowIndex);
            setCurrentGuess(""); // reset currentGuess when clicking a new row
            inputRef.current?.focus(); // فعال کردن فیلد متنی و باز شدن کیبورد
          }}
          style={[
            styles.wordContainer,
            activeRow === rowIndex && styles.activeRow,
          ]}
        >
          {/* نمایش حروف از راست به چپ */}
          {Array(targetWord.length)
            .fill(null)
            .map((_, index) => {
              // محاسبه موقعیت حروف از راست به چپ
              const reverseIndex = targetWord.length - 1 - index;
              const char =
                activeRow === rowIndex
                  ? currentGuess[reverseIndex] || " "
                  : attempts[rowIndex]?.[reverseIndex]?.char || " ";
              const color =
                activeRow === rowIndex
                  ? "black"
                  : attempts[rowIndex]?.[reverseIndex]?.color || "black";

              return (
                <View key={index} style={styles.underlineContainer}>
                  <Text style={[styles.letter, { color }]}>{char}</Text>
                  <View style={styles.underline} />
                </View>
              );
            })}
        </TouchableOpacity>
      ))}

      {/* اینپوت مخفی برای باز کردن کیبورد */}
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={currentGuess}
        onChangeText={(text) => setCurrentGuess(text.substring(0, targetWord.length))}
        maxLength={targetWord.length}
        onSubmitEditing={checkWord}
        keyboardType="default"
      />

      {/* دکمه ریست */}
      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetText}>🔄 شروع مجدد</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  wordContainer: {
    flexDirection: "row",
    marginBottom: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  activeRow: {
    borderColor: "blue",
    borderWidth: 2,
  },
  underlineContainer: {
    alignItems: "center",
    marginHorizontal: 5,
  },
  underline: {
    width: 20,
    height: 2,
    backgroundColor: "black",
    marginTop: 5,
  },
  letter: {
    fontSize: 24,
    textAlign: "center",
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  resetButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "blue", // رنگ آبی برای دکمه
    borderRadius: 5,
  },
  resetText: {
    color: "white",
    fontSize: 18,
  },
});

export default WordGuessGame;
