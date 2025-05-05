/**
 * Улучшенный скрипт для деобфускации JavaScript кода
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Константы для регулярных выражений
const PATTERNS = {
    STRING_ARRAY: /var\s+_0x38aa\s*=\s*\[([\s\S]*?)\]/,
    FUNCTION_DECLARATION: /function\s+(_0x[a-f0-9]+)\s*\(([\s\S]*?)\)\s*\{([\s\S]*?)\}/g,
    VARIABLE_DECLARATION: /var\s+(_0x[a-f0-9]+)\s*=/g,
    HEX_NUMBER: /0x[a-f0-9]+/g,
    ENCODED_STRING: /'[A-Za-z0-9+/=]+='/g
};

// Карта для замены обфусцированных имен
const NAME_MAP = {
    '_0x38aa': 'encodedStrings',
    '_0x4f9e': 'decodeString',
    '_0x2fe5d0': 'cookieManager',
    '_0x3e1e9': 'StateManager',
    '_0x578978': 'initializeCookies',
    '_0x411eff': 'createWrapper',
    '_0x526f08': 'securityCheck',
    '_0x373ea6': 'globalContext',
    '_0x395e49': 'context',
    '_0x4a51ce': 'base64Chars'
};

// Функция для декодирования base64
function decodeBase64(str) {
    try {
        return Buffer.from(str.replace(/=/g, ''), 'base64').toString('utf-8');
    } catch (e) {
        return str;
    }
}

// Функция для замены обфусцированных имен
function deobfuscateNames(code) {
    let deobfuscatedCode = code;

    // Заменяем известные имена
    for (const [obfuscated, clean] of Object.entries(NAME_MAP)) {
        deobfuscatedCode = deobfuscatedCode.replace(
            new RegExp(obfuscated, 'g'),
            clean
        );
    }

    // Находим и заменяем неизвестные обфусцированные имена
    const unknownNames = new Set();
    let match;

    // Поиск функций
    while ((match = PATTERNS.FUNCTION_DECLARATION.exec(code)) !== null) {
        const name = match[1];
        if (!NAME_MAP[name]) {
            unknownNames.add(name);
        }
    }

    // Поиск переменных
    while ((match = PATTERNS.VARIABLE_DECLARATION.exec(code)) !== null) {
        const name = match[1];
        if (!NAME_MAP[name]) {
            unknownNames.add(name);
        }
    }

    // Генерируем имена для неизвестных идентификаторов
    let counter = 0;
    for (const name of unknownNames) {
        deobfuscatedCode = deobfuscatedCode.replace(
            new RegExp(name, 'g'),
            `deobfuscated_${counter++}`
        );
    }

    return deobfuscatedCode;
}

// Функция для декодирования строк
function decodeStrings(code) {
    // Находим массив закодированных строк
    const stringArrayMatch = code.match(PATTERNS.STRING_ARRAY);
    if (!stringArrayMatch) return code;

    // Извлекаем и декодируем строки
    const encodedStrings = stringArrayMatch[1]
        .split(',')
        .map(s => s.trim().replace(/['"]/g, ''))
        .filter(s => s);

    const decodedStrings = encodedStrings.map(decodeBase64);

    // Создаем карту замен
    const replacements = new Map();
    encodedStrings.forEach((encoded, index) => {
        replacements.set(encoded, decodedStrings[index]);
    });

    // Заменяем все закодированные строки
    let deobfuscatedCode = code;
    for (const [encoded, decoded] of replacements) {
        deobfuscatedCode = deobfuscatedCode.replace(
            new RegExp(encoded.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            JSON.stringify(decoded)
        );
    }

    return deobfuscatedCode;
}

// Функция для форматирования кода
function formatCode(code) {
    return code
        // Добавляем переносы строк после точки с запятой
        .replace(/;(?!\n)/g, ';\n')
        // Добавляем переносы строк после открывающей фигурной скобки
        .replace(/{(?!\n)/g, '{\n')
        // Добавляем переносы строк перед закрывающей фигурной скобкой
        .replace(/(?<!\n)}(?!\n)/g, '\n}\n')
        // Добавляем отступы
        .split('\n')
        .map((line, _, lines) => {
            const indent = line.match(/[{}]/g)?.reduce((acc, bracket) => {
                return bracket === '{' ? acc : acc - 1;
            }, lines.slice(0, _).reduce((acc, l) => {
                return acc + (l.match(/[{}]/g)?.reduce((a, b) => a + (b === '{' ? 1 : -1), 0) || 0);
            }, 0)) || 0;
            return '    '.repeat(Math.max(0, indent)) + line.trim();
        })
        .join('\n')
        // Удаляем лишние пустые строки
        .replace(/\n\s*\n\s*\n/g, '\n\n');
}

// Функция для преобразования шестнадцатеричных чисел
function convertHexNumbers(code) {
    return code.replace(PATTERNS.HEX_NUMBER, match => {
        return parseInt(match, 16).toString();
    });
}

// Основная функция деобфускации
function deobfuscate(code) {
    console.log('Начинаем деобфускацию...');

    // 1. Декодируем строки
    console.log('Декодируем строки...');
    let deobfuscatedCode = decodeStrings(code);

    // 2. Заменяем обфусцированные имена
    console.log('Заменяем обфусцированные имена...');
    deobfuscatedCode = deobfuscateNames(deobfuscatedCode);

    // 3. Преобразуем шестнадцатеричные числа
    console.log('Преобразуем шестнадцатеричные числа...');
    deobfuscatedCode = convertHexNumbers(deobfuscatedCode);

    // 4. Форматируем код
    console.log('Форматируем код...');
    deobfuscatedCode = formatCode(deobfuscatedCode);

    return deobfuscatedCode;
}

// Читаем исходный файл
const inputFile = join(__dirname, 'deobfuscated.js');
const outputFile = join(__dirname, 'deobfuscated_clean.js');

try {
    console.log('Читаем исходный файл...');
    const code = readFileSync(inputFile, 'utf-8');
    console.log('Файл успешно прочитан');

    const deobfuscatedCode = deobfuscate(code);

    console.log('Записываем результат...');
    writeFileSync(outputFile, deobfuscatedCode);
    console.log('Деобфускация завершена успешно!');
} catch (error) {
    console.error('Ошибка при деобфускации:', error);
}