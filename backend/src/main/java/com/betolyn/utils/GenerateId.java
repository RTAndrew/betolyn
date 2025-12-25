package com.betolyn.utils;

import com.soundicly.jnanoidenhanced.jnanoid.NanoIdUtils;

public class GenerateId {
    public static String DEFAULT_ALPHABET ="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    public static int DEFAULT_SIZE = 12;

    private String alphabet = DEFAULT_ALPHABET;
    private int size = DEFAULT_SIZE;
    private String prefix = null;

    public  GenerateId() {
    }

    public GenerateId(int size) {
        this.size = size;
    }


    public GenerateId(int size, String prefix) {
        this.size = size;
        this.prefix = prefix;
    }

    public GenerateId(String alphabet, int size) {
        this.alphabet = alphabet;
        this.size = size;
    }

    public GenerateId(String alphabet, int size, String prefix) {
        this.alphabet = alphabet;
        this.size = size;
        this.prefix = prefix;
    }

    public static String random() {
        return NanoIdUtils.randomNanoId(DEFAULT_ALPHABET, 12);
    }


    public String generate() {
        String value = NanoIdUtils.randomNanoId(alphabet, size);
        if (prefix != null)
            return prefix + "_" + value;
        return value;
    }
}
