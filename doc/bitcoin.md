
# What is Bitcoin?

### Last Updated on August 4th, 2017 by Bo Henderson

Bitcoin is just a list a transactions. A Ledger. Nothing super mysterious about it but the problem of having a public ledger is it's really hard to secure. Bitcoin is the first secure public ledger that anyone can update if they follow the rules.


## Mining

Bundles of transactions need to be 'mined' before they can be added to the bitcoin block chain.

Bitcoin represents a breakthrough in the arrangement of one cryptographic lego piece. If you understand this one piece then you know all of the cryptography required to understand bitcoin. Luckily, this one lego piece isn't actually that complicated,, . It's the hash function.

A hash function has a few important properties:
 - It's output provides no information about it's input
 - Some input value always returns the exact same output

An example is the easiest way to understand what exactly is going on.

Imagine this stupidly simple hash function:
 - multiply a given number by 123
 - take the last 3 digits of the result and then multiply them by 456
 - take the last 3 digits of the result and then multiply them by 789
 - return the last 3 digits of the result


```python
#!/usr/bin/python

def hash(n):

    # multiply our input by 123
    temp = n * 123

    # extract the last 3 digits of the result
    temp = str(temp)[len(str(temp))-3:]

    # repeat the above two steps
    temp = n * 456
    temp = str(temp)[len(str(temp))-3:]
    temp = n * 789
    temp = str(temp)[len(str(temp))-3:]

    # print out our result
    print temp

```

Now, we can use this simple hash function as follows:

```
>>> hash(1)
047
>>> hash(2)
578
>>> hash(3)
367
```

This simple hash function has a few important properties:
 - The output doesn't really tell us anything useful about the input because we discard information about the input when we discard everything except the last 3 least significant digits. Over an over: we amplify the input and then extract the least significant few digits.
 - The same input will always generate the same output. This arises because we are doing an entirely deterministic calculation. No random numbers were actually used 

Imagine a situation where I think my friend has my 

If we wanted to hash the number 911 with the above function it would look something like this:

SHA256 is an algorithm that's useful because it's irreversible. If we send the word "wow" into the sha256 function, it will spit out what looks like a lump of digital garbage but this lump of digital garbage is special because it tells you absolutely nothing about this input yet is consistent. If I run sha256 on "wow" the I will get the exact same 

```bash
$ sha256sum <<< "wow"
f40cd21f276e47d533371afce1778447e858eb5c9c0c0ed61c65f5c5d57caf63  -

$ sha256sum <<< "wow "
d206d724020165862e5c2238aae42332f14d1b6f11b52bf296dbf87a3116f878  -

$ sha256sum <<< "wow."
879bd7a9282cb52534dc279af0873b2bdbac04878a72e1eb77101103e0fb9690  -

$ sha256sum <<< "wow"
f40cd21f276e47d533371afce1778447e858eb5c9c0c0ed61c65f5c5d57caf63  -
```



## Wallets & Bitcoin Security

## 

