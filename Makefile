all: upload

.PHONY: upload
upload:
	python3 setup.py sdist bdist_wheel
	python3 -m twine upload --verbose dist/*
