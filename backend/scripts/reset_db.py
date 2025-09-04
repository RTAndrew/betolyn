#!/usr/bin/env python3
"""
Database reset script for React Native Example Backend

This script will:
1. Drop all existing tables
2. Recreate all tables with the current schema
3. Preserve the database but reset all data

Usage:
    python reset_db.py
"""

from utils.database import reset_database

import sys

if __name__ == "__main__":
    print("🔄 Starting database reset...")
    print("⚠️  WARNING: This will delete ALL data in the database!")

    # Ask for confirmation
    response = input("Are you sure you want to continue? (yes/no): ").lower().strip()

    if response in ['yes', 'y']:
        try:
            reset_database()
            print("✅ Database reset completed successfully!")
        except Exception as e:
            print(f"❌ Error resetting database: {e}")
            sys.exit(1)
    else:
        print("❌ Database reset cancelled.")
        sys.exit(0)
