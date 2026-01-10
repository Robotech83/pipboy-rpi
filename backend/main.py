from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psutil
import random
import platform
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

IS_PI = platform.system() == "Linux"

@app.get("/api/stats")
def get_stats():
    cpu = psutil.cpu_percent()
    ram = psutil.virtual_memory().percent
    disk = psutil.disk_usage("/").percent

    if IS_PI:
        temp = 45.0  # placeholder for now
    else:
        temp = random.uniform(35, 75)

    return {
        "hp": max(0, 100 - disk),
        "ap": max(0, 100 - cpu),
        "rads": temp,
        "cpu": cpu,
        "ram": ram,
        "disk": disk
    }
# ======================================================
# INVENTORY FILE BROWSER API
# ======================================================

import os

# Root folder the Pip-Boy is allowed to see
INVENTORY_ROOT = os.path.expanduser("~")

@app.get("/api/inventory")
def get_inventory(path: str = ""):
    """
    Returns a list of files and folders inside INVENTORY_ROOT.
    The 'path' parameter lets us navigate subfolders.
    """

    # Build full path safely
    full_path = os.path.normpath(os.path.join(INVENTORY_ROOT, path))

    # Security check: block directory escape
    if not full_path.startswith(INVENTORY_ROOT):
        return {"error": "ACCESS DENIED"}

    items = []

    try:
        for name in os.listdir(full_path):
            item_path = os.path.join(full_path, name)

            items.append({
                "name": name,
                "type": "folder" if os.path.isdir(item_path) else "file"
            })

    except Exception as e:
        return {"error": str(e)}

    return {
        "path": path,
        "items": items
    }

# ======================================================
# DATA: LOGS & QUESTS API
# ======================================================

DATA_ROOT = os.path.join(os.path.dirname(__file__), "..", "data")

@app.get("/api/data/logs")
def get_logs():
    """
    Returns a list of available log files.
    """
    log_dir = os.path.join(DATA_ROOT, "logs")
    logs = []

    for name in os.listdir(log_dir):
        logs.append(name)

    return logs


@app.get("/api/data/log")
def read_log(name: str):
    """
    Returns the contents of a single log file.
    """
    path = os.path.join(DATA_ROOT, "logs", name)

    if not path.startswith(os.path.join(DATA_ROOT, "logs")):
        return {"error": "ACCESS DENIED"}

    with open(path, "r", encoding="utf-8") as f:
        return {"content": f.read()}


@app.get("/api/data/quests")
def get_quests():
    """
    Returns all quests as JSON.
    """
    quest_dir = os.path.join(DATA_ROOT, "quests")
    quests = []

    for name in os.listdir(quest_dir):
        with open(os.path.join(quest_dir, name), "r", encoding="utf-8") as f:
            quests.append(json.load(f))

    return quests
